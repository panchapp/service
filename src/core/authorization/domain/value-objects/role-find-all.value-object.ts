export class RoleFindAllValueObject {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly searchValue?: string,
    public readonly appId?: string,
  ) {}

  static create(props: {
    page: number;
    limit: number;
    searchValue?: string;
    appId?: string;
  }): RoleFindAllValueObject {
    return new RoleFindAllValueObject(
      props.page,
      props.limit,
      props.searchValue,
      props.appId,
    );
  }
}
