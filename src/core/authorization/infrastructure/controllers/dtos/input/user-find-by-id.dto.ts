import { IsUUID } from 'class-validator';

export class UserFindByIdDto {
  @IsUUID('4')
  userId!: string;
}
