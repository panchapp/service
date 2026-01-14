import { AssignPermissionsToRoleValueObject } from '@/core/authorization/domain/value-objects/assign-permissions-to-role.value-object';
import { RoleAssignPermissionsDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-assign-permissions.dto';

export class RoleAssignmentsValueObjectMapper {
  static toAssignPermissionsValueObject(
    dto: RoleAssignPermissionsDto,
  ): AssignPermissionsToRoleValueObject {
    return AssignPermissionsToRoleValueObject.create({
      permissionIds: dto.permissionIds,
    });
  }
}
