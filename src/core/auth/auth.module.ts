import { AuthService } from '@/core/auth/application/services/auth.service';
import { GoogleOAuthService } from '@/core/auth/application/services/google-oauth.service';
import { REFRESH_TOKENS_REPOSITORY_TOKEN } from '@/core/auth/domain/tokens/refresh-tokens.tokens';
import { AuthController } from '@/core/auth/infrastructure/controllers/auth.controller';
import { GoogleAuthGuard } from '@/core/auth/infrastructure/guards/google-auth.guard';
import { JwtAuthGuard } from '@/core/auth/infrastructure/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@/core/auth/infrastructure/guards/jwt-refresh.guard';
import { KnexRefreshTokensRepository } from '@/core/auth/infrastructure/repositories/knex-refresh-tokens.repository';
import { CookieService } from '@/core/auth/infrastructure/services/cookie.service';
import { HashingService } from '@/core/auth/infrastructure/services/hashing.service';
import { GoogleAuthStrategy } from '@/core/auth/infrastructure/strategies/google-auth.strategy';
import { JwtAuthStrategy } from '@/core/auth/infrastructure/strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from '@/core/auth/infrastructure/strategies/jwt-refresh.strategy';
import { UsersModule } from '@/core/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ConfigModule, PassportModule, UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    CookieService,
    HashingService,
    GoogleOAuthService,
    GoogleAuthStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    GoogleAuthGuard,
    JwtAuthGuard,
    JwtRefreshGuard,
    {
      provide: REFRESH_TOKENS_REPOSITORY_TOKEN,
      useClass: KnexRefreshTokensRepository,
    },
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
