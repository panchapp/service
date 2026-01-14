import { PermissionEntity } from '@/core/authorization/domain/entities/permission.entity';
import { RoleEntity } from '@/core/authorization/domain/entities/role.entity';
import { UserAssignmentsDto } from '@/core/authorization/infrastructure/controllers/dtos/output/user-assignments.dto';
import { PermissionDtoMapper } from '@/core/authorization/infrastructure/controllers/mappers/output/permission-dto.mapper';
import { RoleDtoMapper } from '@/core/authorization/infrastructure/controllers/mappers/output/role-dto.mapper';

export class UserAssignmentsDtoMapper {
  static toDto(props: {
    roles: RoleEntity[];
    permissions: PermissionEntity[];
    appIds: string[];
  }): UserAssignmentsDto {
    const dto = new UserAssignmentsDto();
    dto.roles = RoleDtoMapper.toDtos(props.roles);
    dto.permissions = PermissionDtoMapper.toDtos(props.permissions);
    dto.appIds = props.appIds;
    return dto;
  }
}
