import { AuthService } from '@/auth/application/services/auth.service';
import { SessionEntity } from '@/auth/domain/entities/session.entity';
import { GoogleAuthGuard } from '@/auth/infrastructure/guards/google-auth.guard';
import { JwtAuthGuard } from '@/auth/infrastructure/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '@/auth/infrastructure/guards/jwt-refresh.guard';
import { CookieService } from '@/auth/infrastructure/services/cookie.service';
import { CustomException } from '@/common/exceptions/custom.exception';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity;
    const frontendErrorUrl = this.configService.get<string>('auth.frontendErrorUrl')!;
    const frontendSuccessUrl = this.configService.get<string>('auth.frontendSuccessUrl')!;

    if (!user) return res.redirect(frontendErrorUrl);

    try {
      const accessToken = await this.authService.generateAccessToken(user);
      const refreshToken = await this.authService.generateRefreshToken(user);

      this.cookieService.setAccessTokenCookie(res, accessToken);
      this.cookieService.setRefreshTokenCookie(res, refreshToken);

      return res.redirect(frontendSuccessUrl);
    } catch (error) {
      this.logger.error(error);
      return res.redirect(frontendErrorUrl);
    }
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: Request & { user: { refreshToken: string; userId: string } },
    @Res() res: Response,
  ) {
    try {
      const { refreshToken: oldRefreshToken, userId } = req.user;
      const { accessToken, refreshToken } = await this.authService.refreshTokens(
        oldRefreshToken,
        userId,
      );
      this.cookieService.setAccessTokenCookie(res, accessToken);
      this.cookieService.setRefreshTokenCookie(res, refreshToken);
      return res.json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const sessionEntity = req.user as SessionEntity;
      await this.authService.revokeRefreshToken(sessionEntity.userId);
      this.cookieService.clearAuthCookies(res);
      return res.json({ message: 'Logged out successfully' });
    } catch (error) {
      this.logger.error(error);
      this.cookieService.clearAuthCookies(res);
      return res.json({ message: 'Logged out successfully' });
    }
  }
}
