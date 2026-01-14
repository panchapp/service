import { IsString, IsUUID } from 'class-validator';

export class AppDto {
  @IsUUID('4')
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string | null;
}
