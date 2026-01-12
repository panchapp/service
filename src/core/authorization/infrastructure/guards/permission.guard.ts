// auth.guard.ts
import { SessionEntity } from '@/core/auth/domain/entities/session.entity';
import { PERMISSIONS_KEY } from '@/core/authorization/domain/tokens/authorization.tokens';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: SessionEntity }>();
    if (!user) return false;
    if (user.isSuperAdmin) return true;

    const requiredPerms = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPerms) return true;
    return requiredPerms.every((perm) => user.permissions.includes(perm));
  }
}
