import { GetPageParametersHelper, KeysOf, PageModel } from "..";
import { ListHelper } from "./list-helpers";

export class AsyncFactoryPageModelBuilder<S, T extends object> {
  constructor(
    private readonly asyncBuilderData: (data: S) => Promise<T>,
    private readonly data: S[],
    private readonly optional?: {
      keys?: KeysOf<T>;
    }
  ) {}

  async build(): Promise<PageModel<T>> {
    if (this.data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const firstItem = this.data.shift();

    const firstMappedValue: T = await this.asyncBuilderData(firstItem);

    const getPageParametersFirstHelper = new GetPageParametersHelper<T>(
      firstMappedValue,
      this.optional
    );

    let { keys, values } = getPageParametersFirstHelper.parameters;

    let trueLength = 0;

    values.push(getPageParametersFirstHelper.getValuesFromItem(keys));

    trueLength += 1;

    const response = await new ListHelper(this.data).mapAndCountAsync(
      async (value, index) => {
        try {
          const mappedValue: T = await this.asyncBuilderData(value);

          const getPageParametersHelper = new GetPageParametersHelper<T>(
            mappedValue,
            this.optional
          );

          return getPageParametersHelper.getValuesFromItem(keys);
        } catch (error) {
          console.log(
            "Error in AsyncFactoryPageModelBuilder.\n When index is: ",
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
      }
    );

    values.push(...response.data);
    trueLength += response.count;

    this.data.unshift(firstItem);

    return new PageModel<T>(
      {
        keys,
        values,
      },
      trueLength
    );
  }
}
