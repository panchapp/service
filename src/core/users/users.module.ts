import { UsersService } from '@/core/users/application/services/users.service';
import { USERS_REPOSITORY_TOKEN } from '@/core/users/domain/tokens/users.tokens';
import { UsersController } from '@/core/users/infrastructure/controllers/users.controller';
import { KnexUsersRepository } from '@/core/users/infrastructure/repositories/knex-users.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_REPOSITORY_TOKEN, useClass: KnexUsersRepository },
  ],
  exports: [UsersService, USERS_REPOSITORY_TOKEN],
})
export class UsersModule {}
