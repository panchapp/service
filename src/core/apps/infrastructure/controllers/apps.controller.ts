import { AppsService } from '@/core/apps/application/services/apps.service';
import { AppCreateDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-create.dto';
import { AppFindAllDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-find-all.dto';
import { AppFindByIdDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-find-by-id.dto';
import { AppUpdateDto } from '@/core/apps/infrastructure/controllers/dtos/input/app-update.dto';
import { AppDto } from '@/core/apps/infrastructure/controllers/dtos/output/app.dto';
import { PaginatedAppDto } from '@/core/apps/infrastructure/controllers/dtos/output/paginated-app.dto';
import { AppValueObjectMapper } from '@/core/apps/infrastructure/controllers/mappers/input/app-value-object.mapper';
import { AppDtoMapper } from '@/core/apps/infrastructure/controllers/mappers/output/app-dto.mapper';
import { JwtAuthGuard } from '@/core/auth/infrastructure/guards/jwt-auth.guard';
import { CoreRoles } from '@/core/authorization/domain/enums/roles.enum';
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

@Controller('apps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getAll(@Query() queryDto: AppFindAllDto): Promise<PaginatedAppDto> {
    const valueObject = AppValueObjectMapper.toFindAllValueObject(queryDto);
    const result = await this.appsService.getAll(valueObject);
    return AppDtoMapper.toPaginatedDto(result);
  }

  @Get(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getById(@Param() paramsDto: AppFindByIdDto): Promise<AppDto> {
    const app = await this.appsService.getById(paramsDto.id);
    return AppDtoMapper.toDto(app);
  }

  @Post()
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async create(@Body() bodyDto: AppCreateDto): Promise<AppDto> {
    const valueObject = AppValueObjectMapper.toCreationValueObject(bodyDto);
    const app = await this.appsService.create(valueObject);
    return AppDtoMapper.toDto(app);
  }

  @Put(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async update(
    @Param() paramsDto: AppFindByIdDto,
    @Body() bodyDto: AppUpdateDto,
  ): Promise<AppDto> {
    const valueObject = AppValueObjectMapper.toUpdateValueObject(bodyDto);
    const app = await this.appsService.update(paramsDto.id, valueObject);
    return AppDtoMapper.toDto(app);
  }

  @Delete(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async delete(@Param() paramsDto: AppFindByIdDto): Promise<void> {
    await this.appsService.delete(paramsDto.id);
  }
}
