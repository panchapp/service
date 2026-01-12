import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { PermissionCreationValueObject } from '@/core/authorization/domain/value-objects/permission-creation.value-object';
import { PermissionFindAllValueObject } from '@/core/authorization/domain/value-objects/permission-find-all.value-object';
import { PermissionUpdateValueObject } from '@/core/authorization/domain/value-objects/permission-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export interface PermissionsRepository {
  findAll(
    valueObject: PermissionFindAllValueObject,
  ): Promise<PaginatedEntity<PermissionEntity>>;
  findByAppId(appId: string): Promise<PermissionEntity[]>;
  findById(id: string): Promise<PermissionEntity | null>;
  create(valueObject: PermissionCreationValueObject): Promise<PermissionEntity | null>;
  update(
    id: string,
    valueObject: PermissionUpdateValueObject,
  ): Promise<PermissionEntity | null>;
  delete(id: string): Promise<PermissionEntity | null>;
}
