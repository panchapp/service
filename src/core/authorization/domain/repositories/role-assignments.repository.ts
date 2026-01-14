import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { AssignPermissionsToRoleValueObject } from '@/core/authorization/domain/value-objects/assign-permissions-to-role.value-object';

export interface RoleAssignmentsRepository {
  assignPermissions(
    roleId: string,
    valueObject: AssignPermissionsToRoleValueObject,
  ): Promise<PermissionEntity[]>;
  removePermissions(roleId: string, permissionIds: string[]): Promise<void>;
  getRolePermissions(roleId: string): Promise<PermissionEntity[]>;
}
