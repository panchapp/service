import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { PermissionCreationValueObject } from '@/core/authorization/domain/value-objects/permission-creation.value-object';
import { PermissionUpdateValueObject } from '@/core/authorization/domain/value-objects/permission-update.value-object';
import { isNotNullish } from '@/core/common/utils/type-guards';
import { PermissionDbModel } from '@/database/models/permission-db.model';

export class PermissionPersistenceMapper {
  static toEntity(row: PermissionDbModel): PermissionEntity {
    return PermissionEntity.create({
      id: row.id,
      name: row.name,
      appId: row.app_id,
      createdAt: row.created_at,
    });
  }

  static toDbModelFromCreationValueObject(
    valueObject: PermissionCreationValueObject,
  ): Partial<PermissionDbModel> {
    const dbModel: Partial<PermissionDbModel> = {};
    dbModel.name = valueObject.name;
    dbModel.app_id = valueObject.appId;
    return dbModel;
  }

  static toDbModelFromUpdateValueObject(
    valueObject: PermissionUpdateValueObject,
  ): Partial<PermissionDbModel> {
    const dbModel: Partial<PermissionDbModel> = {};

    if (isNotNullish(valueObject.name)) {
      dbModel.name = valueObject.name;
    }

    if (isNotNullish(valueObject.appId)) {
      dbModel.app_id = valueObject.appId;
    }

    return dbModel;
  }
}
