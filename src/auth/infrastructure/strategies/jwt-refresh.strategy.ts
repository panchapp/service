import { RefreshTokenEntity } from '@/auth/domain/entities/refresh-token.entity';
import { CustomException } from '@/common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.refresh_token as string,
        (req: Request) => ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtRefreshSecret')!,
      passReqToCallback: true,
    });
  }

  validate(payload: unknown, req: Request): { refreshToken: string; userId: string } {
    try {
      const refreshTokenEntity = RefreshTokenEntity.createFromUnknown(payload);
      const refreshToken = req.cookies.refresh_token as string;
      return { refreshToken, userId: refreshTokenEntity.userId };
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
