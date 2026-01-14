export class AssignRolesValueObject {
  constructor(public readonly roleIds: string[]) {}

  static create(props: { roleIds: string[] }): AssignRolesValueObject {
    return new AssignRolesValueObject(props.roleIds);
  }
}
