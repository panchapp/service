import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { PaginatedRoleDto } from '@/core/authorization/infrastructure/controllers/dtos/output/paginated-role.dto';
import { RoleDto } from '@/core/authorization/infrastructure/controllers/dtos/output/role.dto';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export class RoleDtoMapper {
  static toDto(entity: RoleEntity): RoleDto {
    const dto = new RoleDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.appId = entity.appId;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static toDtos(entities: RoleEntity[]): RoleDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPaginatedDto(paginatedEntity: PaginatedEntity<RoleEntity>): PaginatedRoleDto {
    const dto = new PaginatedRoleDto();
    dto.totalCount = paginatedEntity.totalCount;
    dto.currentPage = paginatedEntity.currentPage;
    dto.totalPages = paginatedEntity.totalPages;
    dto.items = this.toDtos(paginatedEntity.items);
    return dto;
  }
}
