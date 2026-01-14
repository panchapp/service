import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class PermissionFindAllDto {
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

  @IsOptional()
  @IsUUID('4')
  appId?: string;
}
