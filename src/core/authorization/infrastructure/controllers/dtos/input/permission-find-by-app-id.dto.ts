import { IsUUID } from 'class-validator';

export class PermissionFindByAppIdDto {
  @IsUUID('4')
  appId!: string;
}
