import { CustomException } from '@/common/exceptions/custom.exception';

export class PersistedRefreshTokenEntity {
  constructor(
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly hashedToken: string,
  ) {}

  static create(props: {
    userId: string;
    expiresAt: Date;
    hashedToken: string;
  }): PersistedRefreshTokenEntity {
    return new PersistedRefreshTokenEntity(
      props.userId,
      props.expiresAt,
      props.hashedToken,
    );
  }

  static createFromUnknown(props: unknown): PersistedRefreshTokenEntity {
    if (typeof props !== 'object' || props === null) {
      throw CustomException.badRequest('Invalid refresh token payload');
    }

    if (!('userId' in props)) {
      throw CustomException.badRequest('User ID is required');
    }

    if (typeof props.userId !== 'string') {
      throw CustomException.badRequest('User ID must be a string');
    }

    if (!('expiresAt' in props)) {
      throw CustomException.badRequest('Expires at is required');
    }

    if (typeof props.expiresAt !== 'string') {
      throw CustomException.badRequest('Expires at must be a string');
    }

    if (!('hashedToken' in props)) {
      throw CustomException.badRequest('Hashed token is required');
    }

    if (typeof props.hashedToken !== 'string') {
      throw CustomException.badRequest('Hashed token must be a string');
    }

    return new PersistedRefreshTokenEntity(
      props.userId,
      new Date(props.expiresAt),
      props.hashedToken,
    );
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
