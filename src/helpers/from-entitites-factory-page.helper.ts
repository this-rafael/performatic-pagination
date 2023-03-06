import { BuildOptionalData, GetPageParametersHelper, PageModel } from "..";

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
      this.data,
      this.optional
    );

    let {
      keys,
      length: trueLength,
      values,
    } = getPageParametersHelper.parameters;

    values.push(getPageParametersHelper.getValuesFromItem(keys));

    values.push(
      ...this.data.map((value, index) => {
        try {
          const getPageParametersHelper = new GetPageParametersHelper<T>(
            value,
            this.data,
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
