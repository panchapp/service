import { CoreRoles } from '@/core/authorization/domain/enums/roles.enum';
import { ROLES_KEY } from '@/core/authorization/domain/tokens/authorization.tokens';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: CoreRoles[]) => SetMetadata(ROLES_KEY, roles);
