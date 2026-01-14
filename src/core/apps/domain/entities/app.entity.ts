export class AppEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
  ) {}

  static create(props: {
    id: string;
    name: string;
    description: string | null;
  }): AppEntity {
    return new AppEntity(props.id, props.name, props.description);
  }
}
