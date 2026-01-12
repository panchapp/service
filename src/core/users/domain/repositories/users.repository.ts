import { PaginatedEntity } from '@/core/common/entities/paginated.entity';
import { UserEntity } from '@/core/users/domain/entities/user.entity';
import { UserCreationValueObject } from '@/core/users/domain/value-objects/user-creation.value-object';
import { UserFindAllValueObject } from '@/core/users/domain/value-objects/user-find-all.value-object';
import { UserUpdateValueObject } from '@/core/users/domain/value-objects/user-update.value-object';

export interface UsersRepository {
  findAll(valueObject: UserFindAllValueObject): Promise<PaginatedEntity<UserEntity>>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByGoogleId(googleId: string): Promise<UserEntity | null>;
  create(valueObject: UserCreationValueObject): Promise<UserEntity | null>;
  update(id: string, valueObject: UserUpdateValueObject): Promise<UserEntity | null>;
  delete(id: string): Promise<UserEntity | null>;
}
