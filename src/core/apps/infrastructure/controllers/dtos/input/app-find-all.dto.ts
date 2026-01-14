import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AppFindAllDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;

  @IsOptional()
  @IsString()
  searchValue?: string;
}
