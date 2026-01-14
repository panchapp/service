import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UserRemovePermissionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
