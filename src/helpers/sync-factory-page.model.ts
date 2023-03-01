import { GetPageParametersHelper, KeysOf, PageModel } from "..";

export class SyncFactoryPageModelBuilder<S, T extends object> {
  constructor(
    private readonly syncBuilderData: (data: S) => T,
    private readonly data: S[],
    private readonly optional?: {
      length?: number;
      keys?: KeysOf<T>;
    }
  ) {}

  build(): PageModel<T> {
    if (this.data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const firstItem = this.data.shift();

    const firstMappedValue: T = this.syncBuilderData(firstItem);

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

    values = this.data.map((value, index) => {
      console.log(value, index);
      const mappedValue: T = this.syncBuilderData(value);

      const getPageParametersHelper = new GetPageParametersHelper<T>(
        mappedValue,
        this.data,
        this.optional
      );

      return getPageParametersHelper.getValuesFromItem(keys);
    });

    return new PageModel<T>(
      {
        keys,
        values,
      },
      trueLength
    );
  }
}
