import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { AppsRepository } from '@/core/apps/domain/repositories/apps.repository';
import { AppCreationValueObject } from '@/core/apps/domain/value-objects/app-creation.value-object';
import { AppFindAllValueObject } from '@/core/apps/domain/value-objects/app-find-all.value-object';
import { AppUpdateValueObject } from '@/core/apps/domain/value-objects/app-update.value-object';
import { AppPersistenceMapper } from '@/core/apps/infrastructure/repositories/mappers/app-persistence.mapper';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { isEmptyObject } from '@/core/common/utils/object-utils';
import { AppDbModel } from '@/database/models/app-db.model';
import { APPS_TABLE_TOKEN } from '@/database/tokens/apps.token';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';

import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexAppsRepository implements AppsRepository {
  private readonly tableName = APPS_TABLE_TOKEN;
  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async findAll(valueObject: AppFindAllValueObject): Promise<PaginatedEntity<AppEntity>> {
    try {
      const { page, limit, searchValue } = valueObject;

      // Build base query for counting and fetching
      let baseQuery = this.db<AppDbModel>(this.tableName);

      // Apply filters
      if (searchValue) {
        baseQuery = baseQuery.where('name', 'ilike', `%${searchValue}%`);
      }

      // Get total count (before pagination)
      const totalCountResult = await baseQuery.clone().count('* as count').first();
      const totalCount = Number(
        (totalCountResult as { count?: string | number })?.count ?? 0,
      );

      // Apply pagination and fetch apps
      const offset = (page - 1) * limit;
      const foundDbApps = await baseQuery.clone().select('*').limit(limit).offset(offset);

      const apps = foundDbApps.map((app) => AppPersistenceMapper.toEntity(app));

      return {
        items: apps,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding all apps');
    }
  }

  async findById(id: string): Promise<AppEntity | null> {
    try {
      const foundDbApp = await this.db<AppDbModel>(this.tableName).where({ id }).first();

      return foundDbApp ? AppPersistenceMapper.toEntity(foundDbApp) : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding app by id');
    }
  }

  async create(appValueObject: AppCreationValueObject): Promise<AppEntity | null> {
    try {
      const appDbModel =
        AppPersistenceMapper.toDbModelFromCreationValueObject(appValueObject);

      const createdDbApp = await this.db<AppDbModel>(this.tableName)
        .insert(appDbModel)
        .returning('*');

      return createdDbApp && createdDbApp.length > 0
        ? AppPersistenceMapper.toEntity(createdDbApp[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error creating app');
    }
  }

  async update(
    id: string,
    appValueObject: AppUpdateValueObject,
  ): Promise<AppEntity | null> {
    try {
      const appDbModel =
        AppPersistenceMapper.toDbModelFromUpdateValueObject(appValueObject);

      if (isEmptyObject(appDbModel)) {
        return this.findById(id);
      }

      const updatedDbApp = await this.db<AppDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .update(appDbModel)
        .returning('*');

      return updatedDbApp && updatedDbApp.length > 0
        ? AppPersistenceMapper.toEntity(updatedDbApp[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error updating app');
    }
  }

  async delete(id: string): Promise<AppEntity | null> {
    try {
      const deletedDbApp = await this.db<AppDbModel>(this.tableName)
        .where({ id })
        .limit(1)
        .delete()
        .returning('*');

      return deletedDbApp && deletedDbApp.length > 0
        ? AppPersistenceMapper.toEntity(deletedDbApp[0])
        : null;
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error deleting app');
    }
  }
}
