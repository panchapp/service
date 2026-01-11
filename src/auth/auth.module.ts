import { AuthService } from '@/auth/application/services/auth.service';
import { GoogleOAuthService } from '@/auth/application/services/google-oauth.service';
import { REFRESH_TOKENS_REPOSITORY_TOKEN } from '@/auth/domain/tokens/refresh-tokens.tokens';
import { AuthController } from '@/auth/infrastructure/controllers/auth.controller';
import { GoogleAuthGuard } from '@/auth/infrastructure/guards/google-auth.guard';
import { JwtAuthGuard } from '@/auth/infrastructure/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@/auth/infrastructure/guards/jwt-refresh.guard';
import { KnexRefreshTokensRepository } from '@/auth/infrastructure/repositories/knex-refresh-tokens.repository';
import { CookieService } from '@/auth/infrastructure/services/cookie.service';
import { HashingService } from '@/auth/infrastructure/services/hashing.service';
import { GoogleAuthStrategy } from '@/auth/infrastructure/strategies/google-auth.strategy';
import { JwtAuthStrategy } from '@/auth/infrastructure/strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from '@/auth/infrastructure/strategies/jwt-refresh.strategy';
import { UsersModule } from '@/users/users.module';
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
