import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { UserAssignmentsRepository } from '@/core/authorization/domain/repositories/user-assignments.repository';
import { AssignAppsValueObject } from '@/core/authorization/domain/value-objects/assign-apps.value-object';
import { AssignPermissionsValueObject } from '@/core/authorization/domain/value-objects/assign-permissions.value-object';
import { AssignRolesValueObject } from '@/core/authorization/domain/value-objects/assign-roles.value-object';
import { PermissionPersistenceMapper } from '@/core/authorization/infrastructure/repositories/mappers/permission-persistence.mapper';
import { RolePersistenceMapper } from '@/core/authorization/infrastructure/repositories/mappers/role-persistence.mapper';
import { PermissionDbModel } from '@/database/models/permission-db.model';
import { RoleDbModel } from '@/database/models/role-db.model';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { PERMISSIONS_TABLE_TOKEN } from '@/database/tokens/permissions.token';
import { ROLES_TABLE_TOKEN } from '@/database/tokens/roles.token';
import { USER_APPS_TABLE_TOKEN } from '@/database/tokens/user-apps.token';
import { USER_PERMISSIONS_TABLE_TOKEN } from '@/database/tokens/user-permissions.token';
import { USER_ROLES_TABLE_TOKEN } from '@/database/tokens/user-roles.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';

import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexUserAssignmentsRepository implements UserAssignmentsRepository {
  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async assignRoles(
    userId: string,
    valueObject: AssignRolesValueObject,
  ): Promise<RoleEntity[]> {
    try {
      const insertData = valueObject.roleIds.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
      }));

      await this.db(USER_ROLES_TABLE_TOKEN)
        .insert(insertData)
        .onConflict(['user_id', 'role_id'])
        .ignore();

      return this.getUserRoles(userId);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error assigning roles to user');
    }
  }

  async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    try {
      await this.db(USER_ROLES_TABLE_TOKEN)
        .where({ user_id: userId })
        .whereIn('role_id', roleIds)
        .delete();
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error removing roles from user');
    }
  }

  async getUserRoles(userId: string): Promise<RoleEntity[]> {
    try {
      const dbRoles: RoleDbModel[] = await this.db<RoleDbModel>(ROLES_TABLE_TOKEN)
        .join(
          USER_ROLES_TABLE_TOKEN,
          `${ROLES_TABLE_TOKEN}.id`,
          `${USER_ROLES_TABLE_TOKEN}.role_id`,
        )
        .where(`${USER_ROLES_TABLE_TOKEN}.user_id`, userId)
        .select(`${ROLES_TABLE_TOKEN}.*`);

      return dbRoles.map((role) => RolePersistenceMapper.toEntity(role));
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error getting user roles');
    }
  }

  async assignPermissions(
    userId: string,
    valueObject: AssignPermissionsValueObject,
  ): Promise<PermissionEntity[]> {
    try {
      const insertData = valueObject.permissionIds.map((permissionId) => ({
        user_id: userId,
        permission_id: permissionId,
      }));

      await this.db(USER_PERMISSIONS_TABLE_TOKEN)
        .insert(insertData)
        .onConflict(['user_id', 'permission_id'])
        .ignore();

      return this.getUserPermissions(userId);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error assigning permissions to user');
    }
  }

  async removePermissions(userId: string, permissionIds: string[]): Promise<void> {
    try {
      await this.db(USER_PERMISSIONS_TABLE_TOKEN)
        .where({ user_id: userId })
        .whereIn('permission_id', permissionIds)
        .delete();
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error removing permissions from user');
    }
  }

  async getUserPermissions(userId: string): Promise<PermissionEntity[]> {
    try {
      const dbPermissions: PermissionDbModel[] = await this.db<PermissionDbModel>(
        PERMISSIONS_TABLE_TOKEN,
      )
        .join(
          USER_PERMISSIONS_TABLE_TOKEN,
          `${PERMISSIONS_TABLE_TOKEN}.id`,
          `${USER_PERMISSIONS_TABLE_TOKEN}.permission_id`,
        )
        .where(`${USER_PERMISSIONS_TABLE_TOKEN}.user_id`, userId)
        .select(`${PERMISSIONS_TABLE_TOKEN}.*`);

      return dbPermissions.map((permission) =>
        PermissionPersistenceMapper.toEntity(permission),
      );
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error getting user permissions');
    }
  }

  async assignApps(
    userId: string,
    valueObject: AssignAppsValueObject,
  ): Promise<string[]> {
    try {
      const insertData = valueObject.appIds.map((appId) => ({
        user_id: userId,
        app_id: appId,
      }));

      await this.db(USER_APPS_TABLE_TOKEN)
        .insert(insertData)
        .onConflict(['user_id', 'app_id'])
        .ignore();

      return this.getUserApps(userId);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error assigning apps to user');
    }
  }

  async removeApps(userId: string, appIds: string[]): Promise<void> {
    try {
      await this.db(USER_APPS_TABLE_TOKEN)
        .where({ user_id: userId })
        .whereIn('app_id', appIds)
        .delete();
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error removing apps from user');
    }
  }

  async getUserApps(userId: string): Promise<string[]> {
    try {
      const dbApps = await this.db(USER_APPS_TABLE_TOKEN)
        .where({ user_id: userId })
        .select('app_id');

      return dbApps.map((row: { app_id: string }) => row.app_id);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error getting user apps');
    }
  }
}
