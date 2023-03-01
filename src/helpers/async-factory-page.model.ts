import { GetPageParametersHelper, KeysOf, PageModel } from "..";

export class AsyncFactoryPageModelBuilder<S, T extends object> {
  constructor(
    private readonly asyncBuilderData: (data: S) => Promise<T>,
    private readonly data: S[],
    private readonly optional?: {
      length?: number;
      keys?: KeysOf<T>;
    }
  ) {}

  async build(): Promise<PageModel<T>> {
    if (this.data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const firstItem = this.data.shift();

    const firstMappedValue: T = await this.asyncBuilderData(firstItem);

    const getPageParametersHelper = new GetPageParametersHelper<T>(
      firstMappedValue,
      this.data,
      this.optional
    );

    let {
      keys,
      length: trueLength,
      values,
    } = getPageParametersHelper.parameters;

    values = await Promise.all(
      this.data.map(async (value, index) => {
        console.log(value, index);
        const mappedValue: T = await this.asyncBuilderData(value);

        const getPageParametersHelper = new GetPageParametersHelper<T>(
          mappedValue,
          this.data,
          this.optional
        );

        return getPageParametersHelper.getValuesFromItem(keys);
      })
    );

    return new PageModel<T>(
      {
        keys,
        values,
      },
      trueLength
    );
  }
}
