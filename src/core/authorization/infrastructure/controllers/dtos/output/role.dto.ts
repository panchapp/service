import { IsDate, IsString, IsUUID } from 'class-validator';

export class RoleDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsUUID()
  appId!: string;

  @IsDate()
  createdAt?: Date;
}
