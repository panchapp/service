export class RoleCreationValueObject {
  constructor(
    public readonly name: string,
    public readonly appId: string,
  ) {}

  static create(props: { name: string; appId: string }): RoleCreationValueObject {
    return new RoleCreationValueObject(props.name, props.appId);
  }
}
