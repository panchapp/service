import { AppDto } from '@/core/apps/infrastructure/controllers/dtos/output/app.dto';
import { PaginatedDto } from '@/core/common/dtos/paginated.dto';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class PaginatedAppDto implements PaginatedDto<AppDto> {
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
  items!: AppDto[];
}
