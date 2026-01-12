import { RefreshTokenEntity } from '@/core/auth/domain/entities/refresh-token.entity';
import { CustomException } from '@/core/common/exceptions/custom.exception';
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

  validate(req: Request, payload: unknown): { refreshToken: string; userId: string } {
    try {
      const refreshTokenEntity = RefreshTokenEntity.createFromUnknown(payload);
      const refreshTokenFromCookie = req.cookies?.refresh_token as string;
      const refreshTokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      const refreshToken = refreshTokenFromHeader ?? refreshTokenFromCookie;
      if (!refreshToken) {
        throw CustomException.unauthorized('Refresh token is required');
      }
      return { refreshToken, userId: refreshTokenEntity.userId };
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
