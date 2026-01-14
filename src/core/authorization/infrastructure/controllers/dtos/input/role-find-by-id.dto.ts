import { IsUUID } from 'class-validator';

export class RoleFindByIdDto {
  @IsUUID('4')
  roleId!: string;
}
