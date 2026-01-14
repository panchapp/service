import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleAssignmentsRepository } from '@/core/authorization/domain/repositories/role-assignments.repository';
import { AssignPermissionsToRoleValueObject } from '@/core/authorization/domain/value-objects/assign-permissions-to-role.value-object';
import { PermissionPersistenceMapper } from '@/core/authorization/infrastructure/repositories/mappers/permission-persistence.mapper';
import { PermissionDbModel } from '@/database/models/permission-db.model';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { PERMISSIONS_TABLE_TOKEN } from '@/database/tokens/permissions.token';
import { ROLE_PERMISSIONS_TABLE_TOKEN } from '@/database/tokens/role-permissions.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexRoleAssignmentsRepository implements RoleAssignmentsRepository {
  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async assignPermissions(
    roleId: string,
    valueObject: AssignPermissionsToRoleValueObject,
  ): Promise<PermissionEntity[]> {
    try {
      const insertData = valueObject.permissionIds.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      }));

      await this.db(ROLE_PERMISSIONS_TABLE_TOKEN)
        .insert(insertData)
        .onConflict(['role_id', 'permission_id'])
        .ignore();

      return this.getRolePermissions(roleId);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error assigning permissions to role');
    }
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    try {
      await this.db(ROLE_PERMISSIONS_TABLE_TOKEN)
        .where({ role_id: roleId })
        .whereIn('permission_id', permissionIds)
        .delete();
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error removing permissions from role');
    }
  }

  async getRolePermissions(roleId: string): Promise<PermissionEntity[]> {
    try {
      const dbPermissions: PermissionDbModel[] = await this.db<PermissionDbModel>(
        PERMISSIONS_TABLE_TOKEN,
      )
        .join(
          ROLE_PERMISSIONS_TABLE_TOKEN,
          `${PERMISSIONS_TABLE_TOKEN}.id`,
          `${ROLE_PERMISSIONS_TABLE_TOKEN}.permission_id`,
        )
        .where(`${ROLE_PERMISSIONS_TABLE_TOKEN}.role_id`, roleId)
        .select(`${PERMISSIONS_TABLE_TOKEN}.*`);

      return dbPermissions.map((permission) =>
        PermissionPersistenceMapper.toEntity(permission),
      );
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error getting role permissions');
    }
  }
}
