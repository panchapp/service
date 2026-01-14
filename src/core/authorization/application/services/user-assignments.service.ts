import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { UserAssignmentsRepository } from '@/core/authorization/domain/repositories/user-assignments.repository';
import { USER_ASSIGNMENTS_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/user-assignments.tokens';
import { AssignAppsValueObject } from '@/core/authorization/domain/value-objects/assign-apps.value-object';
import { AssignPermissionsValueObject } from '@/core/authorization/domain/value-objects/assign-permissions.value-object';
import { AssignRolesValueObject } from '@/core/authorization/domain/value-objects/assign-roles.value-object';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserAssignmentsService {
  constructor(
    @Inject(USER_ASSIGNMENTS_REPOSITORY_TOKEN)
    private readonly userAssignmentsRepository: UserAssignmentsRepository,
  ) {}

  async assignRoles(
    userId: string,
    valueObject: AssignRolesValueObject,
  ): Promise<RoleEntity[]> {
    try {
      return await this.userAssignmentsRepository.assignRoles(userId, valueObject);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    try {
      await this.userAssignmentsRepository.removeRoles(userId, roleIds);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getUserRoles(userId: string): Promise<RoleEntity[]> {
    try {
      return await this.userAssignmentsRepository.getUserRoles(userId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async assignPermissions(
    userId: string,
    valueObject: AssignPermissionsValueObject,
  ): Promise<PermissionEntity[]> {
    try {
      return await this.userAssignmentsRepository.assignPermissions(userId, valueObject);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async removePermissions(userId: string, permissionIds: string[]): Promise<void> {
    try {
      await this.userAssignmentsRepository.removePermissions(userId, permissionIds);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getUserPermissions(userId: string): Promise<PermissionEntity[]> {
    try {
      return await this.userAssignmentsRepository.getUserPermissions(userId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async assignApps(
    userId: string,
    valueObject: AssignAppsValueObject,
  ): Promise<AppEntity[]> {
    try {
      return await this.userAssignmentsRepository.assignApps(userId, valueObject);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async removeApps(userId: string, appIds: string[]): Promise<void> {
    try {
      await this.userAssignmentsRepository.removeApps(userId, appIds);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getUserApps(userId: string): Promise<AppEntity[]> {
    try {
      return await this.userAssignmentsRepository.getUserApps(userId);
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
