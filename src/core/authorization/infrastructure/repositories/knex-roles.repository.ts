import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { RolesRepository } from '@/core/authorization/domain/repositories/roles.repository';
import { RoleCreationValueObject } from '@/core/authorization/domain/value-objects/role-creation.value-object';
import { RoleFindAllValueObject } from '@/core/authorization/domain/value-objects/role-find-all.value-object';
import { RoleUpdateValueObject } from '@/core/authorization/domain/value-objects/role-update.value-object';
import { RolePersistenceMapper } from '@/core/authorization/infrastructure/repositories/mappers/role-persistence.mapper';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { isEmptyObject } from '@/core/common/utils/object-utils';
import { RoleDbModel } from '@/database/models/role-db.model';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { ROLES_TABLE_TOKEN } from '@/database/tokens/roles.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';

import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexRolesRepository implements RolesRepository {
  private readonly tableName = ROLES_TABLE_TOKEN;
  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async findAll(
    valueObject: RoleFindAllValueObject,
  ): Promise<PaginatedEntity<RoleEntity>> {
    try {
      const { page, limit, searchValue, appId } = valueObject;

      // Build base query for counting and fetching
      let baseQuery = this.db<RoleDbModel>(this.tableName);

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

      // Apply pagination and fetch roles
      const offset = (page - 1) * limit;
      const foundDbRoles = await baseQuery
        .clone()
        .select('*')
        .limit(limit)
        .offset(offset);

      const roles = foundDbRoles.map((role) => RolePersistenceMapper.toEntity(role));

      return {
        items: roles,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding all roles');
    }
  }

  async findByAppId(appId: string): Promise<RoleEntity[]> {
    try {
      const foundDbRoles = await this.db<RoleDbModel>(this.tableName)
        .where({ app_id: appId })
        .select('*');

      return foundDbRoles.map((role) => RolePersistenceMapper.toEntity(role));
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding roles by app id');
    }
  }

  async findById(id: string): Promise<RoleEntity | null> {
    try {
      const foundDbRole = await this.db<RoleDbModel>(this.tableName)
        .where({ id })
        .first();

      return foundDbRole ? RolePersistenceMapper.toEntity(foundDbRole) : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding role by id');
    }
  }

  async create(roleValueObject: RoleCreationValueObject): Promise<RoleEntity | null> {
    try {
      const roleDbModel =
        RolePersistenceMapper.toDbModelFromCreationValueObject(roleValueObject);

      const createdDbRole = await this.db<RoleDbModel>(this.tableName)
        .insert(roleDbModel)
        .returning('*');

      return createdDbRole && createdDbRole.length > 0
        ? RolePersistenceMapper.toEntity(createdDbRole[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error creating role');
    }
  }

  async update(
    id: string,
    roleValueObject: RoleUpdateValueObject,
  ): Promise<RoleEntity | null> {
    try {
      const roleDbModel =
        RolePersistenceMapper.toDbModelFromUpdateValueObject(roleValueObject);

      if (isEmptyObject(roleDbModel)) {
        return this.findById(id);
      }

      const updatedDbRole = await this.db<RoleDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .update(roleDbModel)
        .returning('*');

      return updatedDbRole && updatedDbRole.length > 0
        ? RolePersistenceMapper.toEntity(updatedDbRole[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error updating role');
    }
  }

  async delete(id: string): Promise<RoleEntity | null> {
    try {
      const deletedDbRole = await this.db<RoleDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .delete()
        .returning('*');

      return deletedDbRole && deletedDbRole.length > 0
        ? RolePersistenceMapper.toEntity(deletedDbRole[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error deleting role');
    }
  }
}
