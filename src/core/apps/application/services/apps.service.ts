import { AppEntity } from '@/core/apps/domain/entities/app.entity';
import { AppsRepository } from '@/core/apps/domain/repositories/apps.repository';
import { APPS_REPOSITORY_TOKEN } from '@/core/apps/domain/tokens/apps.tokens';
import { AppCreationValueObject } from '@/core/apps/domain/value-objects/app-creation.value-object';
import { AppFindAllValueObject } from '@/core/apps/domain/value-objects/app-find-all.value-object';
import { AppUpdateValueObject } from '@/core/apps/domain/value-objects/app-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppsService {
  constructor(
    @Inject(APPS_REPOSITORY_TOKEN)
    private readonly appsRepository: AppsRepository,
  ) {}

  async getAll(valueObject: AppFindAllValueObject): Promise<PaginatedEntity<AppEntity>> {
    try {
      const foundApps = await this.appsRepository.findAll(valueObject);
      return foundApps;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getById(id: string): Promise<AppEntity> {
    try {
      const foundApp = await this.appsRepository.findById(id);
      if (!foundApp) {
        throw CustomException.notFound('App not found', undefined, { id });
      }
      return foundApp;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async create(valueObject: AppCreationValueObject): Promise<AppEntity> {
    try {
      const createdApp = await this.appsRepository.create(valueObject);
      if (!createdApp) {
        throw CustomException.internalServerError('Failed to create app', undefined, {
          name: valueObject.name,
        });
      }
      return createdApp;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async update(id: string, valueObject: AppUpdateValueObject): Promise<AppEntity> {
    try {
      const updatedApp = await this.appsRepository.update(id, valueObject);
      if (!updatedApp) {
        throw CustomException.notFound('App not found', undefined, { id });
      }
      return updatedApp;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedApp = await this.appsRepository.delete(id);
      if (!deletedApp) {
        throw CustomException.notFound('App not found', undefined, { id });
      }
      return;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
