export class RoleEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly appId: string,
    public readonly createdAt: Date,
  ) {}

  static create(props: {
    id: string;
    name: string;
    appId: string;
    createdAt: Date | string;
  }): RoleEntity {
    return new RoleEntity(
      props.id,
      props.name,
      props.appId,
      props.createdAt instanceof Date ? props.createdAt : new Date(props.createdAt),
    );
  }
}
