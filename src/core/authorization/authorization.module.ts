import { PermissionsService } from '@/core/authorization/application/services/permissions.service';
import { RolesService } from '@/core/authorization/application/services/roles.service';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/permissions.tokens';
import { ROLES_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/roles.tokens';
import { AuthorizationController } from '@/core/authorization/infrastructure/controllers/authorization.controller';
import { PermissionsGuard } from '@/core/authorization/infrastructure/guards/permission.guard';
import { RolesGuard } from '@/core/authorization/infrastructure/guards/roles.guard';
import { KnexPermissionsRepository } from '@/core/authorization/infrastructure/repositories/knex-permissions.repository';
import { KnexRolesRepository } from '@/core/authorization/infrastructure/repositories/knex-roles.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthorizationController],
  providers: [
    RolesService,
    PermissionsService,
    PermissionsGuard,
    RolesGuard,
    { provide: ROLES_REPOSITORY_TOKEN, useClass: KnexRolesRepository },
    { provide: PERMISSIONS_REPOSITORY_TOKEN, useClass: KnexPermissionsRepository },
  ],
  exports: [
    RolesService,
    PermissionsService,
    ROLES_REPOSITORY_TOKEN,
    PERMISSIONS_REPOSITORY_TOKEN,
    PermissionsGuard,
    RolesGuard,
  ],
})
export class AuthorizationModule {}
