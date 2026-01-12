export class PermissionCreationValueObject {
  constructor(
    public readonly name: string,
    public readonly appId: string,
  ) {}

  static create(props: { name: string; appId: string }): PermissionCreationValueObject {
    return new PermissionCreationValueObject(props.name, props.appId);
  }
}
