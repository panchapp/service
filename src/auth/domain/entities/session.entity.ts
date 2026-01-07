import { TokenEntity } from '@/auth/domain/entities/token.entity';

export class SessionEntity extends TokenEntity {
  constructor(public readonly userId: string) {
    super(userId);
  }

  static create(props: { userId: string }): SessionEntity {
    return new SessionEntity(props.userId);
  }
}
