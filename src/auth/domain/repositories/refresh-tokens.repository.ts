import { PersistedRefreshTokenEntity } from '../entities/persisted-refresh-token.entity';

export interface RefreshTokensRepository {
  upsert(refreshTokenEntity: PersistedRefreshTokenEntity): Promise<void>;
  findByUserId(userId: string): Promise<PersistedRefreshTokenEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}
