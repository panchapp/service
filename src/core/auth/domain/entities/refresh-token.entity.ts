import { CustomException } from '@/core/common/exceptions/custom.exception';

export class RefreshTokenEntity {
  constructor(public readonly userId: string) {}

  static create(props: { userId: string }): RefreshTokenEntity {
    return new RefreshTokenEntity(props.userId);
  }

  static createFromUnknown(props: unknown): RefreshTokenEntity {
    if (typeof props !== 'object' || props === null) {
      throw CustomException.badRequest('Invalid refresh token payload');
    }

    if (!('userId' in props)) {
      throw CustomException.badRequest('User ID is required');
    }

    if (typeof props.userId !== 'string') {
      throw CustomException.badRequest('User ID must be a string');
    }

    return new RefreshTokenEntity(props.userId);
  }
}
