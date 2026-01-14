import { IsBoolean, IsDate, IsEmail, IsString, IsUUID } from 'class-validator';

export class UserDto {
  @IsUUID('4')
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsDate()
  createdAt?: Date;

  @IsBoolean()
  isSuperAdmin!: boolean;
}
