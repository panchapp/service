import { IsDate, IsString, IsUUID } from 'class-validator';

export class PermissionDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsUUID()
  appId!: string;

  @IsDate()
  createdAt?: Date;
}
