import { CustomException } from '@/core/common/exceptions/custom.exception';

export class TokenEntity {
  constructor(public readonly userId: string) {}

  static create(props: { userId: string }): TokenEntity {
    return new TokenEntity(props.userId);
  }

  static createFromUnknown(props: unknown): TokenEntity {
    if (typeof props !== 'object' || props === null) {
      throw CustomException.badRequest('Invalid token payload');
    }

    if (!('userId' in props)) {
      throw CustomException.badRequest('User ID is required');
    }

    if (typeof props.userId !== 'string') {
      throw CustomException.badRequest('User ID must be a string');
    }

    return new TokenEntity(props.userId);
  }
}
