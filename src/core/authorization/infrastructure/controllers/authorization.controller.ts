import { JwtAuthGuard } from '@/core/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsService } from '@/core/authorization/application/services/permissions.service';
import { RolesService } from '@/core/authorization/application/services/roles.service';
import { CoreRoles } from '@/core/authorization/domain/enums/roles.enum';
import { PermissionCreateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-create.dto';
import { PermissionFindAllDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-find-all.dto';
import { PermissionFindByAppIdDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-find-by-app-id.dto';
import { PermissionUpdateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/permission-update.dto';
import { RoleCreateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-create.dto';
import { RoleFindAllDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-find-all.dto';
import { RoleFindByAppIdDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-find-by-app-id.dto';
import { RoleUpdateDto } from '@/core/authorization/infrastructure/controllers/dtos/input/role-update.dto';
import { PaginatedPermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/paginated-permission.dto';
import { PaginatedRoleDto } from '@/core/authorization/infrastructure/controllers/dtos/output/paginated-role.dto';
import { PermissionDto } from '@/core/authorization/infrastructure/controllers/dtos/output/permission.dto';
import { RoleDto } from '@/core/authorization/infrastructure/controllers/dtos/output/role.dto';
import { PermissionValueObjectMapper } from '@/core/authorization/infrastructure/controllers/mappers/input/permission-value-object.mapper';
import { RoleValueObjectMapper } from '@/core/authorization/infrastructure/controllers/mappers/input/role-value-object.mapper';
import { PermissionDtoMapper } from '@/core/authorization/infrastructure/controllers/mappers/output/permission-dto.mapper';
import { RoleDtoMapper } from '@/core/authorization/infrastructure/controllers/mappers/output/role-dto.mapper';
import { Roles } from '@/core/authorization/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '@/core/authorization/infrastructure/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('authorization')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthorizationController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  // Roles endpoints
  @Get('roles')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getAllRoles(@Query() queryDto: RoleFindAllDto): Promise<PaginatedRoleDto> {
    const valueObject = RoleValueObjectMapper.toFindAllValueObject(queryDto);
    const result = await this.rolesService.getAll(valueObject);
    return RoleDtoMapper.toPaginatedDto(result);
  }

  @Get('roles/app/:appId')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getRolesByAppId(@Param() paramsDto: RoleFindByAppIdDto): Promise<RoleDto[]> {
    const roles = await this.rolesService.getByAppId(paramsDto.appId);
    return RoleDtoMapper.toDtos(roles);
  }

  @Post('roles')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async createRole(@Body() bodyDto: RoleCreateDto): Promise<RoleDto> {
    const valueObject = RoleValueObjectMapper.toCreationValueObject(bodyDto);
    const role = await this.rolesService.create(valueObject);
    return RoleDtoMapper.toDto(role);
  }

  @Put('roles/:id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async updateRole(
    @Param('id') id: string,
    @Body() bodyDto: RoleUpdateDto,
  ): Promise<RoleDto> {
    const valueObject = RoleValueObjectMapper.toUpdateValueObject(bodyDto);
    const role = await this.rolesService.update(id, valueObject);
    return RoleDtoMapper.toDto(role);
  }

  @Delete('roles/:id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async deleteRole(@Param('id') id: string): Promise<void> {
    await this.rolesService.delete(id);
  }

  // Permissions endpoints
  @Get('permissions')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getAllPermissions(
    @Query() queryDto: PermissionFindAllDto,
  ): Promise<PaginatedPermissionDto> {
    const valueObject = PermissionValueObjectMapper.toFindAllValueObject(queryDto);
    const result = await this.permissionsService.getAll(valueObject);
    return PermissionDtoMapper.toPaginatedDto(result);
  }

  @Get('permissions/app/:appId')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getPermissionsByAppId(
    @Param() paramsDto: PermissionFindByAppIdDto,
  ): Promise<PermissionDto[]> {
    const permissions = await this.permissionsService.getByAppId(paramsDto.appId);
    return PermissionDtoMapper.toDtos(permissions);
  }

  @Post('permissions')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async createPermission(@Body() bodyDto: PermissionCreateDto): Promise<PermissionDto> {
    const valueObject = PermissionValueObjectMapper.toCreationValueObject(bodyDto);
    const permission = await this.permissionsService.create(valueObject);
    return PermissionDtoMapper.toDto(permission);
  }

  @Put('permissions/:id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async updatePermission(
    @Param('id') id: string,
    @Body() bodyDto: PermissionUpdateDto,
  ): Promise<PermissionDto> {
    const valueObject = PermissionValueObjectMapper.toUpdateValueObject(bodyDto);
    const permission = await this.permissionsService.update(id, valueObject);
    return PermissionDtoMapper.toDto(permission);
  }

  @Delete('permissions/:id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async deletePermission(@Param('id') id: string): Promise<void> {
    await this.permissionsService.delete(id);
  }
}
