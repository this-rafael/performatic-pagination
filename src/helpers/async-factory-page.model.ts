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

    const response: T[] = await Promise.all(
      this.data.map(this.asyncBuilderData)
    );

    const trueLength = response.length;

    const firstItem = response[0];

    const getPageParametersFirstHelper = new GetPageParametersHelper<T>(
      firstItem,
      this.optional
    );

    const { keys } = getPageParametersFirstHelper.parameters;

    const values = response.map((item) =>
      new GetPageParametersHelper(item, this.optional).getValuesFromItem(keys)
    );

    values.unshift(getPageParametersFirstHelper.getValuesFromItem(keys));

    return new PageModel<T>(
      {
        keys,
        values,
      },
      trueLength
    );
  }
}
