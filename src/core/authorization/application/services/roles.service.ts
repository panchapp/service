import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { RolesRepository } from '@/core/authorization/domain/repositories/roles.repository';
import { ROLES_REPOSITORY_TOKEN } from '@/core/authorization/domain/tokens/roles.tokens';
import { RoleCreationValueObject } from '@/core/authorization/domain/value-objects/role-creation.value-object';
import { RoleFindAllValueObject } from '@/core/authorization/domain/value-objects/role-find-all.value-object';
import { RoleUpdateValueObject } from '@/core/authorization/domain/value-objects/role-update.value-object';
import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { CustomException } from '@/core/common/exceptions/custom.exception';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLES_REPOSITORY_TOKEN)
    private readonly rolesRepository: RolesRepository,
  ) {}

  async getAll(
    valueObject: RoleFindAllValueObject,
  ): Promise<PaginatedEntity<RoleEntity>> {
    try {
      const foundRoles = await this.rolesRepository.findAll(valueObject);
      return foundRoles;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async getByAppId(appId: string): Promise<RoleEntity[]> {
    try {
      const foundRoles = await this.rolesRepository.findByAppId(appId);
      return foundRoles;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async create(valueObject: RoleCreationValueObject): Promise<RoleEntity> {
    try {
      const createdRole = await this.rolesRepository.create(valueObject);
      if (!createdRole) {
        throw CustomException.internalServerError('Failed to create role', undefined, {
          name: valueObject.name,
          appId: valueObject.appId,
        });
      }
      return createdRole;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async update(id: string, valueObject: RoleUpdateValueObject): Promise<RoleEntity> {
    try {
      const updatedRole = await this.rolesRepository.update(id, valueObject);
      if (!updatedRole) {
        throw CustomException.notFound('Role not found', undefined, { id });
      }
      return updatedRole;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedRole = await this.rolesRepository.delete(id);
      if (!deletedRole) {
        throw CustomException.notFound('Role not found', undefined, { id });
      }
      return;
    } catch (error) {
      throw CustomException.fromOrThrow(error);
    }
  }
}
