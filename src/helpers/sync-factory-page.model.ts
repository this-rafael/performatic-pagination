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

  get page(): PageModel<T> {
    if (this.data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const firstItem = this.data.shift();

    const firstMappedValue: T = this.syncBuilderData(firstItem);

    const getPageParametersFirstHelper = new GetPageParametersHelper<T>(
      firstMappedValue,
      this.data,
      this.optional
    );

    let {
      keys,
      length: trueLength,
      values,
    } = getPageParametersFirstHelper.parameters;

    values.push(getPageParametersFirstHelper.getValuesFromItem(keys));

    values.push(
      ...this.data.map((value, index) => {
        try {
          const mappedValue: T = this.syncBuilderData(value);

          const getPageParametersHelper = new GetPageParametersHelper<T>(
            mappedValue,
            this.data,
            this.optional
          );

          return getPageParametersHelper.getValuesFromItem(keys);
        } catch (error) {
          console.log(
            "Error in SyncFactoryPageModelBuilder.\n When index is: ",
            index,
            "\n",
            "-----------------",
            "value is: ",
            value,
            "-----------------",
            "Error:",
            error
          );

          throw error;
        }
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
