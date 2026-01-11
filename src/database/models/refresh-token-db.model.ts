export interface RefreshTokenDbModel {
  user_id: string;
  expires_at: Date;
  token_hash: string;
  created_at: Date;
}
