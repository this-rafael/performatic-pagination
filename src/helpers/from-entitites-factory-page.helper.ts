import { BuildOptionalData, GetPageParametersHelper, PageModel } from "..";
import { ListHelper } from "./list-helpers";

export class FromEntitiesFactoryPageHelper<T extends object> {
  constructor(
    private readonly data: T[],
    private readonly optional?: BuildOptionalData<T>
  ) {}

  public get page(): PageModel<T> {
    if (this.data[0] === undefined) {
      return PageModel.NIL_PAGE();
    }

    const firstItem = this.data.shift();

    const getPageParametersHelper = new GetPageParametersHelper<T>(
      firstItem,
      this.optional
    );

    let { keys, values } = getPageParametersHelper.parameters;

    values.push(getPageParametersHelper.getValuesFromItem(keys));

    let trueLength = 1;

    const response = new ListHelper(this.data).mapAndCount((value, index) => {
      try {
        const getPageParametersHelper = new GetPageParametersHelper<T>(
          value,
          this.optional
        );

        return getPageParametersHelper.getValuesFromItem(keys);
      } catch (error) {
        console.log(
          "Error in FromEntitiesFactoryPageHelper.\n When index is: ",
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
