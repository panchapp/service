export class AppFindAllValueObject {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly searchValue?: string,
  ) {}

  static create(props: {
    page: number;
    limit: number;
    searchValue?: string;
  }): AppFindAllValueObject {
    return new AppFindAllValueObject(props.page, props.limit, props.searchValue);
  }
}
