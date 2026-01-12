import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class PermissionCreateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsUUID()
  appId!: string;
}
