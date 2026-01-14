export class AppUpdateValueObject {
  constructor(
    public readonly name?: string,
    public readonly description?: string | null,
  ) {}

  static create(props: {
    name?: string;
    description?: string | null;
  }): AppUpdateValueObject {
    return new AppUpdateValueObject(props.name, props.description);
  }
}
