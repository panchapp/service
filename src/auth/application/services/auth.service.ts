import { PersistedRefreshTokenEntity } from '@/auth/domain/entities/persisted-refresh-token.entity';
import { RefreshTokenEntity } from '@/auth/domain/entities/refresh-token.entity';
import { SessionEntity } from '@/auth/domain/entities/session.entity';
import { TokenEntity } from '@/auth/domain/entities/token.entity';
import { RefreshTokensRepository } from '@/auth/domain/repositories/refresh-tokens.repository';
import { REFRESH_TOKENS_REPOSITORY_TOKEN } from '@/auth/domain/tokens/refresh-tokens.tokens';
import { HashingService } from '@/auth/infrastructure/services/hashing.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { UsersService } from '@/users/application/services/users.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingService,
    @Inject(REFRESH_TOKENS_REPOSITORY_TOKEN)
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  async generateSession(payload: unknown): Promise<SessionEntity> {
    try {
      const tokenEntity = TokenEntity.createFromUnknown(payload);
      const user = await this.usersService.getById(tokenEntity.userId);
      const sessionEntity = SessionEntity.create({ userId: user.id });
      return sessionEntity;
    } catch (error) {
      throw CustomException.fromOrThrow(
        error,
        CustomException.unauthorized('Invalid session'),
      );
    }
  }

  async generateAccessToken(user: UserEntity): Promise<string> {
    try {
      const secret = this.configService.get<string>('auth.jwtSecret')!;
      const expiresInMs = this.configService.get<number>('auth.jwtExpirationTime')!;
      const expiresInSeconds = Math.floor(expiresInMs / 1000);
      const tokenEntity = TokenEntity.create({ userId: user.id });
      const tokenOptions = {
        secret,
        expiresIn: expiresInSeconds,
      };
      const tokenObject = instanceToPlain(tokenEntity);
      return await this.jwtService.signAsync(tokenObject, tokenOptions);
    } catch (error) {
      throw CustomException.fromOrThrow(
        error,
        CustomException.unauthorized('Failed to generate access token'),
      );
    }
  }

  async generateRefreshToken(user: UserEntity): Promise<string> {
    try {
      const secret = this.configService.get<string>('auth.jwtRefreshSecret')!;
      const expiresInMs = this.configService.get<number>(
        'auth.jwtRefreshExpirationTime',
      )!;
      const expiresAt = new Date(Date.now() + expiresInMs);
      const expiresInSeconds = Math.floor(expiresInMs / 1000);
      const tokenEntity = RefreshTokenEntity.create({ userId: user.id });
      const tokenOptions = {
        secret,
        expiresIn: expiresInSeconds,
      };
      const tokenObject = instanceToPlain(tokenEntity);
      const token = await this.jwtService.signAsync(tokenObject, tokenOptions);
      const hashedToken = await this.hashingService.hash(token);
      const persistedRefreshTokenEntity = PersistedRefreshTokenEntity.create({
        userId: user.id,
        expiresAt,
        hashedToken,
      });
      await this.refreshTokensRepository.upsert(persistedRefreshTokenEntity);
      return token;
    } catch (error) {
      throw CustomException.fromOrThrow(
        error,
        CustomException.unauthorized('Failed to generate refresh token'),
      );
    }
  }

  async verifyRefreshToken(token: string, userId: string): Promise<RefreshTokenEntity> {
    try {
      const foundRefreshToken = await this.refreshTokensRepository.findByUserId(userId);
      if (!foundRefreshToken) {
        throw CustomException.unauthorized('Refresh token not found');
      }
      if (!foundRefreshToken.hashedToken) {
        throw CustomException.unauthorized('Refresh token hash not found');
      }
      const isTokenValid = await this.hashingService.compare(
        token,
        foundRefreshToken.hashedToken,
      );
      if (!isTokenValid) {
        throw CustomException.unauthorized('Refresh token mismatch');
      }
      if (foundRefreshToken.isExpired()) {
        await this.refreshTokensRepository.deleteByUserId(foundRefreshToken.userId);
        throw CustomException.unauthorized('Refresh token expired');
      }
      return foundRefreshToken;
    } catch (error) {
      throw CustomException.fromOrThrow(
        error,
        CustomException.unauthorized('Invalid refresh token'),
      );
    }
  }

  async refreshTokens(
    refreshToken: string,
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      await this.verifyRefreshToken(refreshToken, userId);
      const user = await this.usersService.getById(userId);
      const newAccessToken = await this.generateAccessToken(user);
      const newRefreshToken = await this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw CustomException.fromOrThrow(
        error,
        CustomException.unauthorized('Failed to refresh access token'),
      );
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    try {
      await this.refreshTokensRepository.deleteByUserId(userId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
