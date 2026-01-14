import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { AppCreationValueObject } from '@/core/apps/domain/value-objects/app-creation.value-object';
import { AppFindAllValueObject } from '@/core/apps/domain/value-objects/app-find-all.value-object';
import { AppUpdateValueObject } from '@/core/apps/domain/value-objects/app-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export interface AppsRepository {
  findAll(valueObject: AppFindAllValueObject): Promise<PaginatedEntity<AppEntity>>;
  findById(id: string): Promise<AppEntity | null>;
  create(valueObject: AppCreationValueObject): Promise<AppEntity | null>;
  update(id: string, valueObject: AppUpdateValueObject): Promise<AppEntity | null>;
  delete(id: string): Promise<AppEntity | null>;
}
