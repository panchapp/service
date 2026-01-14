import { AppCreationValueObject } from '@/core/apps/domain/value-objects/app-creation.value-object';
import { AppFindAllValueObject } from '@/core/apps/domain/value-objects/app-find-all.value-object';
import { AppUpdateValueObject } from '@/core/apps/domain/value-objects/app-update.value-object';
import { AppCreateDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-create.dto';
import { AppFindAllDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-find-all.dto';
import { AppUpdateDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-update.dto';

export class AppValueObjectMapper {
  static toCreationValueObject(dto: AppCreateDto): AppCreationValueObject {
    return AppCreationValueObject.create({
      name: dto.name,
      description: dto.description ?? null,
    });
  }

  static toUpdateValueObject(dto: AppUpdateDto): AppUpdateValueObject {
    return AppUpdateValueObject.create({
      name: dto.name,
      description: dto.description,
    });
  }

  static toFindAllValueObject(dto: AppFindAllDto): AppFindAllValueObject {
    return AppFindAllValueObject.create({
      page: dto.page,
      limit: dto.limit,
      searchValue: dto.searchValue,
    });
  }
}
