export class AssignPermissionsToRoleValueObject {
  constructor(public readonly permissionIds: string[]) {}

  static create(props: { permissionIds: string[] }): AssignPermissionsToRoleValueObject {
    return new AssignPermissionsToRoleValueObject(props.permissionIds);
  }
}
