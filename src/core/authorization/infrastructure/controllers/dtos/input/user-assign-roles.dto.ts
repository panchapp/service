import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UserAssignRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  roleIds!: string[];
}
