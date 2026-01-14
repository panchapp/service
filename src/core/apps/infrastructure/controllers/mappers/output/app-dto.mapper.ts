import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { AppDto } from '@/core/apps/infrastructure/controllers/dtos/output/app.dto';
import { PaginatedAppDto } from '@/core/apps/infrastructure/controllers/dtos/output/paginated-app.dto';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';

export class AppDtoMapper {
  static toDto(entity: AppEntity): AppDto {
    const dto = new AppDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }

  static toDtos(entities: AppEntity[]): AppDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPaginatedDto(paginatedEntity: PaginatedEntity<AppEntity>): PaginatedAppDto {
    const dto = new PaginatedAppDto();
    dto.totalCount = paginatedEntity.totalCount;
    dto.currentPage = paginatedEntity.currentPage;
    dto.totalPages = paginatedEntity.totalPages;
    dto.items = this.toDtos(paginatedEntity.items);
    return dto;
  }
}
