import { PersistedRefreshTokenEntity } from '@/core/auth/domain/entities/persisted-refresh-token.entity';
import { RefreshTokenDbModel } from '@/database/models/refresh-token-db.model';

export class AuthPersistenceMapper {
  static toPersistedRefreshTokenEntity(
    row: RefreshTokenDbModel,
  ): PersistedRefreshTokenEntity {
    return PersistedRefreshTokenEntity.create({
      userId: row.user_id,
      expiresAt: row.expires_at,
      hashedToken: row.token_hash,
    });
  }
}
