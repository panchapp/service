import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { PermissionsRepository } from '@/core/authorization/domain/repositories/permissions.repository';
import { PermissionCreationValueObject } from '@/core/authorization/domain/value-objects/permission-creation.value-object';
import { PermissionFindAllValueObject } from '@/core/authorization/domain/value-objects/permission-find-all.value-object';
import { PermissionUpdateValueObject } from '@/core/authorization/domain/value-objects/permission-update.value-object';
import { PermissionPersistenceMapper } from '@/core/authorization/infrastructure/repositories/mappers/permission-persistence.mapper';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { isEmptyObject } from '@/core/common/utils/object-utils';
import { PermissionDbModel } from '@/database/models/permission-db.model';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { PERMISSIONS_TABLE_TOKEN } from '@/database/tokens/permissions.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';

import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexPermissionsRepository implements PermissionsRepository {
  private readonly tableName = PERMISSIONS_TABLE_TOKEN;
  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async findAll(
    valueObject: PermissionFindAllValueObject,
  ): Promise<PaginatedEntity<PermissionEntity>> {
    try {
      const { page, limit, searchValue, appId } = valueObject;

      // Build base query for counting and fetching
      let baseQuery = this.db<PermissionDbModel>(this.tableName);

      // Apply filters
      if (searchValue) {
        baseQuery = baseQuery.where('name', 'ilike', `%${searchValue}%`);
      }

      if (appId) {
        baseQuery = baseQuery.where('app_id', appId);
      }

      // Get total count (before pagination)
      const totalCountResult = await baseQuery.clone().count('* as count').first();
      const totalCount = Number(
        (totalCountResult as { count?: string | number })?.count ?? 0,
      );

      // Apply pagination and fetch permissions
      const offset = (page - 1) * limit;
      const foundDbPermissions = await baseQuery
        .clone()
        .select('*')
        .limit(limit)
        .offset(offset);

      const permissions = foundDbPermissions.map((permission) =>
        PermissionPersistenceMapper.toEntity(permission),
      );

      return {
        items: permissions,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding all permissions');
    }
  }

  async findByAppId(appId: string): Promise<PermissionEntity[]> {
    try {
      const foundDbPermissions = await this.db<PermissionDbModel>(this.tableName)
        .where({ app_id: appId })
        .select('*');

      return foundDbPermissions.map((permission) =>
        PermissionPersistenceMapper.toEntity(permission),
      );
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding permissions by app id');
    }
  }

  async findById(id: string): Promise<PermissionEntity | null> {
    try {
      const foundDbPermission = await this.db<PermissionDbModel>(this.tableName)
        .where({ id })
        .first();

      return foundDbPermission
        ? PermissionPersistenceMapper.toEntity(foundDbPermission)
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding permission by id');
    }
  }

  async create(
    permissionValueObject: PermissionCreationValueObject,
  ): Promise<PermissionEntity | null> {
    try {
      const permissionDbModel =
        PermissionPersistenceMapper.toDbModelFromCreationValueObject(
          permissionValueObject,
        );

      const createdDbPermission = await this.db<PermissionDbModel>(this.tableName)
        .insert(permissionDbModel)
        .returning('*');

      return createdDbPermission && createdDbPermission.length > 0
        ? PermissionPersistenceMapper.toEntity(createdDbPermission[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error creating permission');
    }
  }

  async update(
    id: string,
    permissionValueObject: PermissionUpdateValueObject,
  ): Promise<PermissionEntity | null> {
    try {
      const permissionDbModel =
        PermissionPersistenceMapper.toDbModelFromUpdateValueObject(permissionValueObject);

      if (isEmptyObject(permissionDbModel)) {
        return this.findById(id);
      }

      const updatedDbPermission = await this.db<PermissionDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .update(permissionDbModel)
        .returning('*');

      return updatedDbPermission && updatedDbPermission.length > 0
        ? PermissionPersistenceMapper.toEntity(updatedDbPermission[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error updating permission');
    }
  }

  async delete(id: string): Promise<PermissionEntity | null> {
    try {
      const deletedDbPermission = await this.db<PermissionDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .delete()
        .returning('*');

      return deletedDbPermission && deletedDbPermission.length > 0
        ? PermissionPersistenceMapper.toEntity(deletedDbPermission[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error deleting permission');
    }
  }
}
