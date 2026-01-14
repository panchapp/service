export class AssignAppsValueObject {
  constructor(public readonly appIds: string[]) {}

  static create(props: { appIds: string[] }): AssignAppsValueObject {
    return new AssignAppsValueObject(props.appIds);
  }
}
