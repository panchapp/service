export class AssignPermissionsValueObject {
  constructor(public readonly permissionIds: string[]) {}

  static create(props: { permissionIds: string[] }): AssignPermissionsValueObject {
    return new AssignPermissionsValueObject(props.permissionIds);
  }
}
