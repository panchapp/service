import { RoleCreationValueObject } from '@/core/authorization/domain/value-objects/role-creation.value-object';
import { RoleFindAllValueObject } from '@/core/authorization/domain/value-objects/role-find-all.value-object';
import { RoleUpdateValueObject } from '@/core/authorization/domain/value-objects/role-update.value-object';
import { RoleCreateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-create.dto';
import { RoleFindAllDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-find-all.dto';
import { RoleUpdateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-update.dto';

export class RoleValueObjectMapper {
  static toCreationValueObject(dto: RoleCreateDto): RoleCreationValueObject {
    return RoleCreationValueObject.create({
      name: dto.name,
      appId: dto.appId,
    });
  }

  static toUpdateValueObject(dto: RoleUpdateDto): RoleUpdateValueObject {
    return RoleUpdateValueObject.create({
      name: dto.name,
      appId: dto.appId,
    });
  }

  static toFindAllValueObject(dto: RoleFindAllDto): RoleFindAllValueObject {
    return RoleFindAllValueObject.create({
      page: dto.page,
      limit: dto.limit,
      searchValue: dto.searchValue,
      appId: dto.appId,
    });
  }
}
