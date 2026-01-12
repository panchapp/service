import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

type SameSite = 'strict' | 'lax' | 'none';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  private getCookieOptions(maxAge?: number): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: SameSite;
    path: string;
    maxAge?: number;
  } {
    const secure = this.configService.get<boolean>('auth.cookieSecure')!;
    const sameSite = this.configService.get<string>('auth.cookieSameSite')!;

    return {
      httpOnly: true,
      secure,
      sameSite: sameSite as SameSite,
      path: '/',
      ...(maxAge !== undefined && { maxAge }),
    };
  }

  private getClearCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: SameSite;
    path: string;
  } {
    const secure = this.configService.get<boolean>('auth.cookieSecure')!;
    const sameSite = this.configService.get<string>('auth.cookieSameSite')!;

    return {
      httpOnly: true,
      secure,
      sameSite: sameSite as SameSite,
      path: '/',
    };
  }

  setAccessTokenCookie(res: Response, token: string): void {
    const expirationTime = this.configService.get<number>('auth.jwtExpirationTime')!;
    res.cookie('access_token', token, this.getCookieOptions(expirationTime));
  }

  setRefreshTokenCookie(res: Response, token: string): void {
    const expirationTime = this.configService.get<number>(
      'auth.jwtRefreshExpirationTime',
    )!;
    const options = this.getCookieOptions(expirationTime);
    res.cookie('refresh_token', token, options);
  }

  clearAuthCookies(res: Response): void {
    const options = this.getClearCookieOptions();
    res.clearCookie('access_token', options);
    res.clearCookie('refresh_token', options);
  }
}
