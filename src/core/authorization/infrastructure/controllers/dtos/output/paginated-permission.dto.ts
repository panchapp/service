import { PermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/permission.dto';
import { PaginatedDto } from '@/core/common/dtos/paginated.dto';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class PaginatedPermissionDto implements PaginatedDto<PermissionDto> {
  @IsInt()
  @Min(0)
  totalCount!: number;

  @IsInt()
  @Min(1)
  currentPage!: number;

  @IsInt()
  @Min(0)
  totalPages!: number;

  @IsArray()
  @ValidateNested({ each: true })
  items!: PermissionDto[];
}
