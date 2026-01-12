import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { PermissionsRepository } from '@/core/authorization/domain/repositories/permissions.repository';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/permissions.tokens';
import { PermissionCreationValueObject } from '@/core/authorization/domain/value-objects/permission-creation.value-object';
import { PermissionFindAllValueObject } from '@/core/authorization/domain/value-objects/permission-find-all.value-object';
import { PermissionUpdateValueObject } from '@/core/authorization/domain/value-objects/permission-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSIONS_REPOSITORY_TOKEN)
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async getAll(
    valueObject: PermissionFindAllValueObject,
  ): Promise<PaginatedEntity<PermissionEntity>> {
    try {
      const foundPermissions = await this.permissionsRepository.findAll(valueObject);
      return foundPermissions;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getByAppId(appId: string): Promise<PermissionEntity[]> {
    try {
      const foundPermissions = await this.permissionsRepository.findByAppId(appId);
      return foundPermissions;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async create(valueObject: PermissionCreationValueObject): Promise<PermissionEntity> {
    try {
      const createdPermission = await this.permissionsRepository.create(valueObject);
      if (!createdPermission) {
        throw CustomException.internalServerError(
          'Failed to create permission',
          undefined,
          {
            name: valueObject.name,
            appId: valueObject.appId,
          },
        );
      }
      return createdPermission;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async update(
    id: string,
    valueObject: PermissionUpdateValueObject,
  ): Promise<PermissionEntity> {
    try {
      const updatedPermission = await this.permissionsRepository.update(id, valueObject);
      if (!updatedPermission) {
        throw CustomException.notFound('Permission not found', undefined, { id });
      }
      return updatedPermission;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedPermission = await this.permissionsRepository.delete(id);
      if (!deletedPermission) {
        throw CustomException.notFound('Permission not found', undefined, { id });
      }
      return;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
