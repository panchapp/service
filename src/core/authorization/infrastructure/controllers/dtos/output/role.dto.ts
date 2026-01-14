import { IsDate, IsString, IsUUID } from 'class-validator';

export class RoleDto {
  @IsUUID('4')
  id!: string;

  @IsString()
  name!: string;

  @IsUUID('4')
  appId!: string;

  @IsDate()
  createdAt?: Date;
}
