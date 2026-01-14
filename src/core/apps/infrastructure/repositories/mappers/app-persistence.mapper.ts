import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { AppCreationValueObject } from '@/core/apps/domain/value-objects/app-creation.value-object';
import { AppUpdateValueObject } from '@/core/apps/domain/value-objects/app-update.value-object';
import { isNotNullish } from '@/core/common/utils/type-guards';
import { AppDbModel } from '@/database/models/app-db.model';

export class AppPersistenceMapper {
  static toEntity(row: AppDbModel): AppEntity {
    return AppEntity.create({
      id: row.id,
      name: row.name,
      description: row.description,
    });
  }

  static toDbModelFromCreationValueObject(
    valueObject: AppCreationValueObject,
  ): Partial<AppDbModel> {
    const dbModel: Partial<AppDbModel> = {};
    dbModel.name = valueObject.name;
    dbModel.description = valueObject.description;
    return dbModel;
  }

  static toDbModelFromUpdateValueObject(
    valueObject: AppUpdateValueObject,
  ): Partial<AppDbModel> {
    const dbModel: Partial<AppDbModel> = {};

    if (isNotNullish(valueObject.name)) {
      dbModel.name = valueObject.name;
    }

    if (isNotNullish(valueObject.description)) {
      dbModel.description = valueObject.description;
    }

    return dbModel;
  }
}
