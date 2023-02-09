import {
  AtHelper,
  BuildOneItemPageModelHelper,
  GetPageParametersHelper,
  MapHelper,
} from "../helpers/page-model.helpers";
import {
  PageProperties,
  ValuesType,
  KeysOfT,
  BuildOptionalData,
} from "../types/base-types";

export class PageModel<T extends object> {
  /**
   * Creates an instance of PageModel.
   * @param {PageProperties<T>} data - Data of the page
   * @param {number} length - Length of the page
   * @memberof PageModel
   */
  constructor(readonly data: PageProperties<T>, readonly length: number) {}

  /**
   * get the data of the page as an object
   *
   * @return {*}  {object}
   * @memberof PageModel
   */
  public getData(): object {
    return { keys: this.data.keys, values: this.data.values };
  }

  /**
   * get the values of the page
   *
   * @return {*}  {ValuesType<T>}
   * @memberof PageModel
   */
  public getValues(): ValuesType<T> {
    return this.data.values;
  }

  /**
   * get the keys of the page
   *
   * @return {*}  {KeysOfT<T>}
   * @memberof PageModel
   */
  public getKeys(): KeysOfT<T> {
    return this.data.keys;
  }

  /**
   * Get the item at the given index of the page as an object
   *
   * @param {number} index
   * @return {*}  {T}
   * @memberof PageModel
   */
  public at(index: number): T {
    return new AtHelper<T>(this).at(index);
  }

  /**
   * Map the page to another type of page with the given callback function
   *
   * @template S - Type of the mapped page
   * @param {(value: T, index: number) => S} callbackfn - Callback function to map the page
   * @return {*}  {PageModel<S>}
   * @memberof PageModel
   */
  public map<S extends object = any>(
    callbackfn: (value: T, index: number) => S
  ): PageModel<S> {
    return new MapHelper<T, S>(this).map(callbackfn);
  }

  /**
   * Map the page to another type of page with the given async callback function
   *
   *
   * @template S - Type of the mapped page
   * @param {(value: T, index: number) => Promise<S>} callbackfn - Callback function to map the page
   * @return {*}  {Promise<PageModel<S>>}
   * @memberof PageModel
   */
  public async asyncMap<S extends object = any>(
    callbackfn: (value: T, index: number) => Promise<S>
  ): Promise<PageModel<S>> {
    return new MapHelper<T, S>(this).asyncMap(callbackfn);
  }

  /**
   * Get the page as a list of objects
   *
   * @readonly
   * @type {T[]}
   * @memberof PageModel
   */
  public get asList(): T[] {
    const list: T[] = [];
    for (let i = 0; i < this.length; i += 1) {
      list.push(this.at(i));
    }
    return list;
  }

  /**
   * Factory method to build a page model from a list of objects of type T (T extends object)
   *
   * @static
   * @template T - Type of the data of the page
   * @param {T[]} data - Data of the page
   * @param {BuildOptionalData<T>} [optional] - Optional data to build the page
   * @return {*}  {PageModel<T>}
   * @memberof PageModel
   */
  public static fromEntriesData<T extends object>(
    data: T[],
    optional?: BuildOptionalData<T>
  ): PageModel<T> {
    if (data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const haveOnlyOneElement = data[0] !== undefined && data[1] === undefined;

    if (haveOnlyOneElement) {
      return new BuildOneItemPageModelHelper<T, T>(
        data,
        optional
      ).getFirstItemSync((e) => e);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = data[0];

    const { keys, length, values } = new GetPageParametersHelper<T>(
      firstObject,
      data,
      optional
    ).parameters;

    const firstValues = new GetPageParametersHelper<T>(
      firstObject,
      data,
      optional
    ).getValuesFromItem(keys);

    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      const nextIndex = currentIndex + 1;

      const current: T = data[currentIndex];

      if (!current) break;

      // add current to the page
      const currentValues = new GetPageParametersHelper<T>(
        current,
        data,
        optional
      ).getValuesFromItem(keys);

      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = data[nextIndex];

        // add next to the page
        const nextValues = new GetPageParametersHelper<T>(
          next,
          data,
          optional
        ).getValuesFromItem(keys);

        if (nextValues.length > 0) {
          values.push(nextValues);
          trueLength += 1;
        }
      }
    }

    return new PageModel({ keys, values }, trueLength);
  }

  /**
   * Factory method to build a page model from a list of objects of type T (T extends object) using a builder function to build the data from the given data
   *
   * @static
   * @template T - Type of the data of the page
   * @template S - Type of the data to build the page
   * @param {(data: S) => T} builderData - Builder function to build the data of the page
   * @param {S[]} data - Data to build the page
   * @param {{
   *       keys?: KeysOfT<T>
   *       length?: number
   *     }} [optional] - Optional data to build the page
   * @return {*}  {PageModel<T>} - Page model
   * @memberof PageModel
   */
  public static fromSyncFactory<T extends object, S>(
    builderData: (data: S) => T,
    data: S[],
    optional?: {
      keys?: KeysOfT<T>;
      length?: number;
    }
  ): PageModel<T> {
    if (data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const haveOnlyOneElement = data[0] !== undefined && data[1] === undefined;

    if (haveOnlyOneElement) {
      return new BuildOneItemPageModelHelper<T, S>(
        data,
        optional
      ).getFirstItemSync(builderData);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = builderData(data[0]);

    const getFirstValuesParametersHelper = new GetPageParametersHelper<T>(
      firstObject,
      data,
      optional
    );

    const { keys, length, values } = getFirstValuesParametersHelper.parameters;

    const firstValues = getFirstValuesParametersHelper.getValuesFromItem(keys);

    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      const nextIndex = currentIndex + 1;

      const originalData = data[currentIndex];
      if (!originalData) break;
      const current: T = builderData(originalData);

      // add current to the page
      const currentValues = new GetPageParametersHelper<T>(
        current,
        data,
        optional
      ).getValuesFromItem(keys);

      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = builderData(data[nextIndex]);

        // add next to the page
        const nextValues = new GetPageParametersHelper<T>(
          next,
          data,
          optional
        ).getValuesFromItem(keys);

        if (nextValues.length > 0) {
          values.push(nextValues);
          trueLength += 1;
        }
      }
    }

    return new PageModel({ keys, values }, trueLength);
  }

  /**
   * Factory method to build a page model from a list of objects of type T (T extends object) using an async builder function to build the data from the given data
   * The async builder function is called for each data of the list
   * The page is built when all the data are built
   *
   * @static
   * @template T - Type of the data of the page
   * @template S - Type of the data to build the page
   * @param {(data: S) => Promise<T>} asyncBuilderData - Async builder function to build the data of the page
   * @param {S[]} data - Data to build the page
   * @param {{
   *       keepSort?: boolean
   *       length?: number
   *       keys?: KeysOfT<T>
   *     }} [optional] - Optional data to build the page
   * @return {*}  {Promise<PageModel<T>>} - Page model
   * @memberof PageModel
   */
  // eslint-disable-next-line complexity
  public static async fromAsyncFactory<T extends object, S>(
    asyncBuilderData: (data: S) => Promise<T>,
    data: S[],
    optional?: {
      keepSort?: boolean;
      length?: number;
      keys?: KeysOfT<T>;
    }
  ): Promise<PageModel<T>> {
    if (data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const haveOnlyOneElement = data[0] !== undefined && data[1] === undefined;
    // check if the data are only one and if it is the case, return a page with only one data
    if (haveOnlyOneElement) {
      return new BuildOneItemPageModelHelper<T, S>(
        data,
        optional
      ).getFirstItemAsync(asyncBuilderData);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = await asyncBuilderData(data[0]);

    const firstItemValuesHelper = new GetPageParametersHelper<T>(
      firstObject,
      data,
      optional
    );
    const { keys, length, values } = firstItemValuesHelper.parameters;

    const firstValues = firstItemValuesHelper.getValuesFromItem(keys);

    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    // iterate over the data to build the page
    // interate using next index
    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      // iterate with current and next index
      const nextIndex = currentIndex + 1;

      const originalData = data[currentIndex];
      if (!originalData) break;

      const current: T = await asyncBuilderData(originalData);

      // add current to the page
      const currentValues = new GetPageParametersHelper<T>(
        current,
        data,
        optional
      ).getValuesFromItem(keys);

      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = await asyncBuilderData(data[nextIndex]);

        // add next to the page
        const nextValues = new GetPageParametersHelper<T>(
          next,
          data,
          optional
        ).getValuesFromItem(keys);

        if (nextValues.length > 0) {
          values.push(nextValues);
          trueLength += 1;
        }
      }
    }

    return new PageModel({ keys, values }, trueLength);
  }

  private static NIL_PAGE<T extends object>(): PageModel<T> {
    return new PageModel(
      {
        keys: [],
        values: [],
      },
      0
    );
  }
}
