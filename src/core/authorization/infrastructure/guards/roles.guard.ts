// auth.guard.ts
import { SessionEntity } from '@/core/auth/domain/entities/session.entity';
import { ROLES_KEY } from '@/core/authorization/domain/tokens/authorization.tokens';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: SessionEntity }>();
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
