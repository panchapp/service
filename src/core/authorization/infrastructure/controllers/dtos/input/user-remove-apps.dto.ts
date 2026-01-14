import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UserRemoveAppsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  appIds!: string[];
}
