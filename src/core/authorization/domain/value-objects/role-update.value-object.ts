export class RoleUpdateValueObject {
  constructor(
    public readonly name?: string,
    public readonly appId?: string,
  ) {}

  static create(props: { name?: string; appId?: string }): RoleUpdateValueObject {
    return new RoleUpdateValueObject(props.name, props.appId);
  }
}
