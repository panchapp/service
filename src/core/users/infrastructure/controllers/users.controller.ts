import { JwtAuthGuard } from '@/core/auth/infrastructure/guards/jwt-auth.guard';
import { CoreRoles } from '@/core/authorization/domain/enums/roles.enum';
import { Roles } from '@/core/authorization/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '@/core/authorization/infrastructure/guards/roles.guard';
import { UsersService } from '@/core/users/application/services/users.service';
import { UserCreateDto } from '@/core/users/infrastructure/controllers/dtos/input/user-create.dto';
import { UserFindAllDto } from '@/core/users/infrastructure/controllers/dtos/input/user-find-all.dto';
import { UserFindByEmailDto } from '@/core/users/infrastructure/controllers/dtos/input/user-find-by-email.dto';
import { UserFindByIdDto } from '@/core/users/infrastructure/controllers/dtos/input/user-find-by-id.dto';
import { UserUpdateDto } from '@/core/users/infrastructure/controllers/dtos/input/user-update.dto';
import { PaginatedUserDto } from '@/core/users/infrastructure/controllers/dtos/output/paginated-user.dto';
import { UserDto } from '@/core/users/infrastructure/controllers/dtos/output/user.dto';
import { UserValueObjectMapper } from '@/core/users/infrastructure/controllers/mappers/input/user-value-object.mapper';
import { UserDtoMapper } from '@/core/users/infrastructure/controllers/mappers/output/user-dto.mapper';
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

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getAll(@Query() queryDto: UserFindAllDto): Promise<PaginatedUserDto> {
    const valueObject = UserValueObjectMapper.toFindAllValueObject(queryDto);
    const result = await this.usersService.getAll(valueObject);
    return UserDtoMapper.toPaginatedDto(result);
  }

  @Get(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getById(@Param() paramsDto: UserFindByIdDto): Promise<UserDto> {
    const user = await this.usersService.getById(paramsDto.id);
    return UserDtoMapper.toDto(user);
  }

  @Get('email/:email')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER, CoreRoles.USER)
  async getByEmail(@Param() paramsDto: UserFindByEmailDto): Promise<UserDto> {
    const user = await this.usersService.getByEmail(paramsDto.email);
    return UserDtoMapper.toDto(user);
  }

  @Post()
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async create(@Body() bodyDto: UserCreateDto): Promise<UserDto> {
    const valueObject = UserValueObjectMapper.toCreationValueObject(bodyDto);
    const user = await this.usersService.create(valueObject);
    return UserDtoMapper.toDto(user);
  }

  @Put(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async update(
    @Param() paramsDto: UserFindByIdDto,
    @Body() bodyDto: UserUpdateDto,
  ): Promise<UserDto> {
    const valueObject = UserValueObjectMapper.toUpdateValueObject(bodyDto);
    const user = await this.usersService.update(paramsDto.id, valueObject);
    return UserDtoMapper.toDto(user);
  }

  @Delete(':id')
  @Roles(CoreRoles.ADMIN, CoreRoles.MANAGER)
  async delete(@Param() paramsDto: UserFindByIdDto): Promise<void> {
    await this.usersService.delete(paramsDto.id);
  }
}
