import { AppsService } from '@/core/apps/application/services/apps.service';
import { APPS_REPOSITORY_TOKEN } from '@/core/apps/domain/tokens/apps.tokens';
import { AppsController } from '@/core/apps/infrastructure/controllers/apps.controller';
import { KnexAppsRepository } from '@/core/apps/infrastructure/repositories/knex-apps.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AppsController],
  providers: [
    AppsService,
    { provide: APPS_REPOSITORY_TOKEN, useClass: KnexAppsRepository },
  ],
  exports: [AppsService, APPS_REPOSITORY_TOKEN],
})
export class AppsModule {}
