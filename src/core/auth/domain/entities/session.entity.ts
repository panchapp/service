import { TokenEntity } from '@/core/auth/domain/entities/token.entity';

export class SessionEntity extends TokenEntity {
  constructor(
    public readonly userId: string,
    public readonly isSuperAdmin: boolean,
    public readonly roles: string[],
    public readonly permissions: string[],
  ) {
    super(userId);
  }

  static create(props: {
    userId: string;
    isSuperAdmin: boolean;
    roles: string[];
    permissions: string[];
  }): SessionEntity {
    return new SessionEntity(
      props.userId,
      props.isSuperAdmin,
      props.roles,
      props.permissions,
    );
  }
}
