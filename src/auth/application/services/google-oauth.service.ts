import { GoogleProfile } from '@/auth/infrastructure/strategies/google-auth.strategy';
import { CustomException } from '@/common/exceptions/custom.exception';
import { UsersService } from '@/users/application/services/users.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserCreationValueObject } from '@/users/domain/value-objects/user-creation.value-object';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleOAuthService {
  constructor(private readonly usersService: UsersService) {}

  async findOrCreateUser(profile: GoogleProfile): Promise<UserEntity> {
    try {
      const foundUser = await this.validateUser(profile);
      if (foundUser) return foundUser;
      return this.createUser(profile);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async validateUser(profile: GoogleProfile): Promise<UserEntity | null> {
    try {
      const googleId = profile.id;
      return await this.usersService.getByGoogleId(googleId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async createUser(profile: GoogleProfile): Promise<UserEntity> {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;
      const googleId = profile.id;

      const valueObject = UserCreationValueObject.create({
        email,
        name: name || email.split('@')[0],
        googleId,
        isSuperAdmin: false,
      });

      return this.usersService.create(valueObject);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
