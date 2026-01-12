import { AuthService } from '@/core/auth/application/services/auth.service';
import { SessionEntity } from '@/core/auth/domain/entities/session.entity';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.access_token as string,
        (req: Request) => ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtSecret')!,
    });
  }

  async validate(payload: unknown): Promise<SessionEntity> {
    try {
      return await this.authService.generateSession(payload);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
