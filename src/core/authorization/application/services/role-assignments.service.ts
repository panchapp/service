import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleAssignmentsRepository } from '@/core/authorization/domain/repositories/role-assignments.repository';
import { ROLE_ASSIGNMENTS_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/role-assignments.tokens';
import { AssignPermissionsToRoleValueObject } from '@/core/authorization/domain/value-objects/assign-permissions-to-role.value-object';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoleAssignmentsService {
  constructor(
    @Inject(ROLE_ASSIGNMENTS_REPOSITORY_TOKEN)
    private readonly roleAssignmentsRepository: RoleAssignmentsRepository,
  ) {}

  async assignPermissions(
    roleId: string,
    valueObject: AssignPermissionsToRoleValueObject,
  ): Promise<PermissionEntity[]> {
    try {
      return await this.roleAssignmentsRepository.assignPermissions(roleId, valueObject);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    try {
      await this.roleAssignmentsRepository.removePermissions(roleId, permissionIds);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getRolePermissions(roleId: string): Promise<PermissionEntity[]> {
    try {
      return await this.roleAssignmentsRepository.getRolePermissions(roleId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
