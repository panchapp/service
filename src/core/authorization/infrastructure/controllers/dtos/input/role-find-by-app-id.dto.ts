import { IsUUID } from 'class-validator';

export class RoleFindByAppIdDto {
  @IsUUID()
  appId!: string;
}
