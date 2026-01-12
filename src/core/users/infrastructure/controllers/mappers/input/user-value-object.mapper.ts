import { UserCreationValueObject } from '@/core/users/domain/value-objects/user-creation.value-object';
import { UserFindAllValueObject } from '@/core/users/domain/value-objects/user-find-all.value-object';
import { UserUpdateValueObject } from '@/core/users/domain/value-objects/user-update.value-object';
import { UserCreateDto } from '@/core/users/infrastructure/controllers/dtos/input/user-create.dto';
import { UserFindAllDto } from '@/core/users/infrastructure/controllers/dtos/input/user-find-all.dto';
import { UserUpdateDto } from '@/core/users/infrastructure/controllers/dtos/input/user-update.dto';

export class UserValueObjectMapper {
  static toCreationValueObject(dto: UserCreateDto): UserCreationValueObject {
    return UserCreationValueObject.create({
      email: dto.email,
      name: dto.name,
      googleId: dto.googleId,
      isSuperAdmin: dto.isSuperAdmin,
    });
  }

  static toUpdateValueObject(dto: UserUpdateDto): UserUpdateValueObject {
    return UserUpdateValueObject.create({
      email: dto.email,
      name: dto.name,
      googleId: dto.googleId,
      isSuperAdmin: dto.isSuperAdmin,
    });
  }

  static toFindAllValueObject(dto: UserFindAllDto): UserFindAllValueObject {
    return UserFindAllValueObject.create({
      page: dto.page,
      limit: dto.limit,
      searchValue: dto.searchValue,
      isSuperAdmin: dto.isSuperAdmin,
    });
  }
}
