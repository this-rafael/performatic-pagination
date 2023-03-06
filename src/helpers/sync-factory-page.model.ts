import { GetPageParametersHelper, KeysOf, PageModel } from "..";
import { ListHelper } from "./list-helpers";

export class SyncFactoryPageModelBuilder<S, T extends object> {
  constructor(
    private readonly syncBuilderData: (data: S) => T,
    private readonly data: S[],
    private readonly optional?: {
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
      this.optional
    );

    let { keys, values } = getPageParametersFirstHelper.parameters;

    values.push(getPageParametersFirstHelper.getValuesFromItem(keys));

    let trueLength = 1;

    const response = new ListHelper(this.data).mapAndCount((value, index) => {
      try {
        const mappedValue: T = this.syncBuilderData(value);

        const getPageParametersHelper = new GetPageParametersHelper<T>(
          mappedValue,
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
    });

    values.push(...response.data);
    trueLength += response.count;

    return new PageModel<T>(
      {
        keys,
        values,
      },
      trueLength
    );
  }
}
