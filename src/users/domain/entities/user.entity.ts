export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly googleId: string,
    public readonly isSuperAdmin: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    email: string;
    name: string;
    googleId: string;
    isSuperAdmin: boolean;
    createdAt: Date | string;
  }): UserEntity {
    return new UserEntity(
      props.id,
      props.email,
      props.name,
      props.googleId,
      props.isSuperAdmin,
      props.createdAt instanceof Date ? props.createdAt : new Date(props.createdAt),
    );
  }
}
