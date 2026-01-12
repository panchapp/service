export class PermissionUpdateValueObject {
  constructor(
    public readonly name?: string,
    public readonly appId?: string,
  ) {}

  static create(props: { name?: string; appId?: string }): PermissionUpdateValueObject {
    return new PermissionUpdateValueObject(props.name, props.appId);
  }
}
