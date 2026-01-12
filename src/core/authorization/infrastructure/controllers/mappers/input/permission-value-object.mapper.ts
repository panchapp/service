import { PermissionCreationValueObject } from '@/core/authorization/domain/value-objects/permission-creation.value-object';
import { PermissionFindAllValueObject } from '@/core/authorization/domain/value-objects/permission-find-all.value-object';
import { PermissionUpdateValueObject } from '@/core/authorization/domain/value-objects/permission-update.value-object';
import { PermissionCreateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-create.dto';
import { PermissionFindAllDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-find-all.dto';
import { PermissionUpdateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-update.dto';

export class PermissionValueObjectMapper {
  static toCreationValueObject(dto: PermissionCreateDto): PermissionCreationValueObject {
    return PermissionCreationValueObject.create({
      name: dto.name,
      appId: dto.appId,
    });
  }

  static toUpdateValueObject(dto: PermissionUpdateDto): PermissionUpdateValueObject {
    return PermissionUpdateValueObject.create({
      name: dto.name,
      appId: dto.appId,
    });
  }

  static toFindAllValueObject(dto: PermissionFindAllDto): PermissionFindAllValueObject {
    return PermissionFindAllValueObject.create({
      page: dto.page,
      limit: dto.limit,
      searchValue: dto.searchValue,
      appId: dto.appId,
    });
  }
}
