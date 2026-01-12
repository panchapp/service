import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { RoleCreationValueObject } from '@/core/authorization/domain/value-objects/role-creation.value-object';
import { RoleUpdateValueObject } from '@/core/authorization/domain/value-objects/role-update.value-object';
import { isNotNullish } from '@/core/common/utils/type-guards';
import { RoleDbModel } from '@/database/models/role-db.model';

export class RolePersistenceMapper {
  static toEntity(row: RoleDbModel): RoleEntity {
    return RoleEntity.create({
      id: row.id,
      name: row.name,
      appId: row.app_id,
      createdAt: row.created_at,
    });
  }

  static toDbModelFromCreationValueObject(
    valueObject: RoleCreationValueObject,
  ): Partial<RoleDbModel> {
    const dbModel: Partial<RoleDbModel> = {};
    dbModel.name = valueObject.name;
    dbModel.app_id = valueObject.appId;
    return dbModel;
  }

  static toDbModelFromUpdateValueObject(
    valueObject: RoleUpdateValueObject,
  ): Partial<RoleDbModel> {
    const dbModel: Partial<RoleDbModel> = {};

    if (isNotNullish(valueObject.name)) {
      dbModel.name = valueObject.name;
    }

    if (isNotNullish(valueObject.appId)) {
      dbModel.app_id = valueObject.appId;
    }

    return dbModel;
  }
}
