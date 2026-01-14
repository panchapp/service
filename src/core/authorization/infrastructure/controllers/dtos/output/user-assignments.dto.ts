import { PermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/permission.dto';
import { RoleDto } from '@/core/authorization/infrastructure/controllers/dtos/output/role.dto';
import { IsArray, IsUUID } from 'class-validator';

export class UserAssignmentsDto {
  @IsArray()
  roles!: RoleDto[];

  @IsArray()
  permissions!: PermissionDto[];

  @IsArray()
  @IsUUID('4', { each: true })
  appIds!: string[];
}
