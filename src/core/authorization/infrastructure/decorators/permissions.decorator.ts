import { CorePermissions } from '@/core/authorization/domain/enums/permissions.enum';
import { PERMISSIONS_KEY } from '@/core/authorization/domain/tokens/authorization.tokens';
import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: CorePermissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
