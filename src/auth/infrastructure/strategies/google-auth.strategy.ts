import { GoogleOAuthService } from '@/auth/application/services/google-oauth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

export interface GoogleProfile {
  id: string;
  emails: Array<{ value: string; verified?: boolean }>;
  displayName: string;
  photos?: Array<{ value: string }>;
}

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google-auth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    super({
      clientID: configService.get<string>('auth.googleClientId')!,
      clientSecret: configService.get<string>('auth.googleClientSecret')!,
      callbackURL: configService.get<string>('auth.googleCallbackUrl')!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const foundUser = await this.googleOAuthService.findOrCreateUser(profile);
      done(undefined, foundUser);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
}
