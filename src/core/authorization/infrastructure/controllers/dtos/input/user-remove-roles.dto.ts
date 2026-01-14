import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UserRemoveRolesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  roleIds!: string[];
}
