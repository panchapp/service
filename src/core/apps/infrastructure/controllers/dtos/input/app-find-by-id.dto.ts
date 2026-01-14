import { IsUUID } from 'class-validator';

export class AppFindByIdDto {
  @IsUUID('4')
  id!: string;
}
