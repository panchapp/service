export class AppCreationValueObject {
  constructor(
    public readonly name: string,
    public readonly description: string | null,
  ) {}

  static create(props: {
    name: string;
    description: string | null;
  }): AppCreationValueObject {
    return new AppCreationValueObject(props.name, props.description);
  }
}
