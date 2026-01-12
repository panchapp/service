import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { PaginatedPermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/paginated-permission.dto';
import { PermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/permission.dto';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export class PermissionDtoMapper {
  static toDto(entity: PermissionEntity): PermissionDto {
    const dto = new PermissionDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.appId = entity.appId;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static toDtos(entities: PermissionEntity[]): PermissionDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPaginatedDto(
    paginatedEntity: PaginatedEntity<PermissionEntity>,
  ): PaginatedPermissionDto {
    const dto = new PaginatedPermissionDto();
    dto.totalCount = paginatedEntity.totalCount;
    dto.currentPage = paginatedEntity.currentPage;
    dto.totalPages = paginatedEntity.totalPages;
    dto.items = this.toDtos(paginatedEntity.items);
    return dto;
  }
}
