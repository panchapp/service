import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { AssignAppsValueObject } from '@/core/authorization/domain/value-objects/assign-apps.value-object';
import { AssignPermissionsValueObject } from '@/core/authorization/domain/value-objects/assign-permissions.value-object';
import { AssignRolesValueObject } from '@/core/authorization/domain/value-objects/assign-roles.value-object';

export interface UserAssignmentsRepository {
  assignRoles(userId: string, valueObject: AssignRolesValueObject): Promise<RoleEntity[]>;
  removeRoles(userId: string, roleIds: string[]): Promise<void>;
  getUserRoles(userId: string): Promise<RoleEntity[]>;

  assignPermissions(
    userId: string,
    valueObject: AssignPermissionsValueObject,
  ): Promise<PermissionEntity[]>;
  removePermissions(userId: string, permissionIds: string[]): Promise<void>;
  getUserPermissions(userId: string): Promise<PermissionEntity[]>;

  assignApps(userId: string, valueObject: AssignAppsValueObject): Promise<AppEntity[]>;
  removeApps(userId: string, appIds: string[]): Promise<void>;
  getUserApps(userId: string): Promise<AppEntity[]>;
}
