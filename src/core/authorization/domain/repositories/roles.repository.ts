import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { RoleCreationValueObject } from '@/core/authorization/domain/value-objects/role-creation.value-object';
import { RoleFindAllValueObject } from '@/core/authorization/domain/value-objects/role-find-all.value-object';
import { RoleUpdateValueObject } from '@/core/authorization/domain/value-objects/role-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export interface RolesRepository {
  findAll(valueObject: RoleFindAllValueObject): Promise<PaginatedEntity<RoleEntity>>;
  findByAppId(appId: string): Promise<RoleEntity[]>;
  findById(id: string): Promise<RoleEntity | null>;
  create(valueObject: RoleCreationValueObject): Promise<RoleEntity | null>;
  update(id: string, valueObject: RoleUpdateValueObject): Promise<RoleEntity | null>;
  delete(id: string): Promise<RoleEntity | null>;
}
