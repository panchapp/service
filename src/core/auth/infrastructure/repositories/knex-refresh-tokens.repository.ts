import { PersistedRefreshTokenEntity } from '@/core/auth/domain/entities/persisted-refresh-token.entity';
import { RefreshTokensRepository } from '@/core/auth/domain/repositories/refresh-tokens.repository';
import { AuthPersistenceMapper } from '@/core/auth/infrastructure/repositories/mappers/auth-persistence.mapper';
import { RefreshTokenDbModel } from '@/database/models/refresh-token-db.model';
import { KNEX_DATABASE_TOKEN } from '@/database/tokens/database.token';
import { REFRESH_TOKENS_TABLE_TOKEN } from '@/database/tokens/refresh-tokens.token';
import { handlePgDatabaseError } from '@/database/utils/error-handler.util';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class KnexRefreshTokensRepository implements RefreshTokensRepository {
  private readonly tableName = REFRESH_TOKENS_TABLE_TOKEN;

  constructor(@Inject(KNEX_DATABASE_TOKEN) private readonly db: Knex) {}

  async upsert(refreshTokenEntity: PersistedRefreshTokenEntity): Promise<void> {
    try {
      await this.db<RefreshTokenDbModel>(this.tableName)
        .insert({
          user_id: refreshTokenEntity.userId,
          token_hash: refreshTokenEntity.hashedToken,
          expires_at: refreshTokenEntity.expiresAt,
        })
        .onConflict('user_id')
        .merge({
          token_hash: refreshTokenEntity.hashedToken,
          expires_at: refreshTokenEntity.expiresAt,
        });
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error upserting refresh token');
    }
  }

  async findByUserId(userId: string): Promise<PersistedRefreshTokenEntity | null> {
    try {
      const foundToken = await this.db<RefreshTokenDbModel>(this.tableName)
        .where({ user_id: userId })
        .first();

      if (!foundToken) return null;

      return AuthPersistenceMapper.toPersistedRefreshTokenEntity(foundToken);
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error finding refresh token');
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await this.db<RefreshTokenDbModel>(this.tableName)
        .where('user_id', userId)
        .delete();
    } catch (error) {
      throw handlePgDatabaseError(error, 'Error deleting refresh token by user id');
    }
  }
}
