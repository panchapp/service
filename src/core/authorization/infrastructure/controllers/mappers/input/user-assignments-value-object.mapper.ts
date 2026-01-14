import { AssignAppsValueObject } from '@/core/authorization/domain/value-objects/assign-apps.value-object';
import { AssignPermissionsValueObject } from '@/core/authorization/domain/value-objects/assign-permissions.value-object';
import { AssignRolesValueObject } from '@/core/authorization/domain/value-objects/assign-roles.value-object';
import { UserAssignAppsDto } from '@/core/authorization/infrastructure/controllers/dtos/input/user-assign-apps.dto';
import { UserAssignPermissionsDto } from '@/core/authorization/infrastructure/controllers/dtos/input/user-assign-permissions.dto';
import { UserAssignRolesDto } from '@/core/authorization/infrastructure/controllers/dtos/input/user-assign-roles.dto';

export class UserAssignmentsValueObjectMapper {
  static toAssignRolesValueObject(dto: UserAssignRolesDto): AssignRolesValueObject {
    return AssignRolesValueObject.create({
      roleIds: dto.roleIds,
    });
  }

  static toAssignPermissionsValueObject(
    dto: UserAssignPermissionsDto,
  ): AssignPermissionsValueObject {
    return AssignPermissionsValueObject.create({
      permissionIds: dto.permissionIds,
    });
  }

  static toAssignAppsValueObject(dto: UserAssignAppsDto): AssignAppsValueObject {
    return AssignAppsValueObject.create({
      appIds: dto.appIds,
    });
  }
}
