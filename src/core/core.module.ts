import { AppsModule } from '@/core/apps/apps.module';
import { AuthModule } from '@/core/auth/auth.module';
import { AuthorizationModule } from '@/core/authorization/authorization.module';
import { UsersModule } from '@/core/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, UsersModule, AuthorizationModule, AppsModule],
  exports: [AuthModule, UsersModule, AuthorizationModule],
})
export class CoreModule {}
