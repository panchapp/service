import { IsUUID } from 'class-validator';

export class PermissionFindByAppIdDto {
  @IsUUID()
  appId!: string;
}
