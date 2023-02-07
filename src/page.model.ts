/* eslint-disable complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/prefer-at */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable unicorn/prevent-abbreviations */

/**
 * ValuesType<T> is the type of the values of an object T
 */
export type ValuesType<T> = T[keyof T][][];

/**
 *  KeysOfT<T> is the type of the keys of an object T
 */
export type KeysOfT<T> = (keyof T)[];

/**
 * PageProperties<T> is the type of the properties of a page
 */
export interface PageProperties<T extends object> {
  keys: KeysOfT<T>;

  values: ValuesType<T>;
}

/**
 * BuildOptionalData<T> is the type of the optional data to build a page model
 */
export type BuildOptionalData<T> = {
  keepSort?: boolean;
  keys?: KeysOfT<T>;
  length?: number;
};

/**
 * PageModel<T>
 * @description
 * is the model of a page of data of type T (T extends object)
 * This class have 3 high complex methods. They are: factory, fromBuilderData and fromAsyncBuilderData
 * These methods are used to create a PageModel from a list of objects each with its particularities but
 * with the same structure.
 * The general algorithm for these methods is
 * 1. Verify if the data its empty if so return an empty page (NIL PAGE)
 * 2. Map the firstObject of the data to a T object
 * 3. Set Keys of keys passed opitionally or the keys of the firstObject
 *  Set length of the page to the length passed optionally or the length of the data
 *  Set values as a empty array
 * 4. Define a variable to calculate the true length of items
 * 5. Map the firstObject to an array of your values
 * 6. If the values of the firstObject are not empty push the values of to the values of the page and
 * increment the true length of items
 * 7. Map the rest of the data to an array of your values
 * The interation happens two elements at a time current and next
 * 8. if  next are empty get values from the current object and push them to the values of the page
 * and increment the true length of items at last break iteration
 * 9. if next are not empty get an pair of values from the current and next object and push them to the values of the page
 * and increment the true length of items in 2
 * 10. At end of the iteration if length is even number
 *   get the last value of the current object and push it to the values of the page if the value is not empty
 *  and increment the true length of items
 * 11. in the end return a new instance of PageModel with the keys, values and length = true length of items
 *
 *
 *
 * @export
 * @class PageModel
 * @template T - Type of the data of the page
 */
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
    if (index < 0) {
      // eslint-disable-next-line no-param-reassign
      index = this.data.values.length + index;
    }
    const item = {} as T;
    for (const [i, key] of this.data.keys.entries()) {
      item[key] = this.data.values[index][i];
    }
    return item;
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
    const mappedValues: S[keyof S][][] = this.data.values.map(
      (itemValues, index) => {
        const item = this.at(index);
        return Object.values(callbackfn(item, index)) as S[keyof S][];
      }
    );

    const keys = Object.keys(callbackfn(this.at(0), 0)) as (keyof S)[];

    return new PageModel<S>({ keys, values: mappedValues }, this.length);
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
    const mappedValues = [] as S[keyof S][][];
    for (let index = 0; index < this.length; index += 1) {
      const item = this[index];
      const value = await callbackfn(item, index);
      mappedValues.push(value as S[keyof S][]);
    }
    const keys = Object.keys(callbackfn(this.at(0), 0)) as (keyof S)[];
    return new PageModel<S>({ keys, values: mappedValues }, this.length);
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
  public static factory<T extends object>(
    data: T[],
    optional?: BuildOptionalData<T>
  ): PageModel<T> {
    if (data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    if (data[0] === undefined) {
      return PageModel.NIL_PAGE<T>();
    }

    const haveOnlyOneElement = data[0] !== undefined && data[1] === undefined;

    if (haveOnlyOneElement) {
      return PageModel.oneItemPageSync<T, T>((e) => e, data, optional);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = data[0];

    const { keys, length, values } = PageModel.getPageParameters(
      firstObject,
      data,
      optional
    );

    const firstValues = PageModel.getValuesFromOneObject<T>(keys, firstObject);
    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      const nextIndex = currentIndex + 1;

      const current: T = data[currentIndex];

      // add current to the page
      const currentValues = PageModel.getValuesFromOneObject<T>(keys, current);
      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = data[nextIndex];

        // add next to the page
        const nextValues = PageModel.getValuesFromOneObject<T>(keys, next);
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
  public static fromBuilderData<T extends object, S>(
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
      return PageModel.oneItemPageSync<T, S>(builderData, data, optional);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = builderData(data[0]);

    const { keys, length, values } = PageModel.getPageParameters(
      firstObject,
      data,
      optional
    );

    const firstValues = PageModel.getValuesFromOneObject<T>(keys, firstObject);
    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      const nextIndex = currentIndex + 1;

      const current: T = builderData(data[currentIndex]);

      // add current to the page
      const currentValues = PageModel.getValuesFromOneObject<T>(keys, current);
      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = builderData(data[nextIndex]);

        // add next to the page
        const nextValues = PageModel.getValuesFromOneObject<T>(keys, next);
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
  public static async fromAsyncBuilderData<T extends object, S>(
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
      return PageModel.oneItemPageAsync<T, S>(asyncBuilderData, data, optional);
    }

    let trueLength = 0;
    // but if the data are more than one, we need to build the page
    // iterate over the data to build the page
    const firstObject: T = await asyncBuilderData(data[0]);

    const { keys, length, values } = PageModel.getPageParameters(
      firstObject,
      data,
      optional
    );

    const firstValues = PageModel.getValuesFromOneObject<T>(keys, firstObject);
    if (firstValues.length > 0) {
      values.push(firstValues);
      trueLength += 1;
    }

    // iterate over the data to build the page
    // interate using next index
    for (let currentIndex = 1; currentIndex < length; currentIndex += 2) {
      // iterate with current and next index
      const nextIndex = currentIndex + 1;

      const current: T = await asyncBuilderData(data[currentIndex]);

      // add current to the page
      const currentValues = PageModel.getValuesFromOneObject<T>(keys, current);
      if (currentValues.length > 0) {
        values.push(currentValues);
        trueLength += 1;
      }

      if (nextIndex < length) {
        const next: T = await asyncBuilderData(data[nextIndex]);

        // add next to the page
        const nextValues = PageModel.getValuesFromOneObject<T>(keys, next);
        if (nextValues.length > 0) {
          values.push(nextValues);
          trueLength += 1;
        }
      }
    }

    return new PageModel({ keys, values }, trueLength);
  }

  private static async oneItemPageAsync<T extends object, S>(
    asyncBuilderData: (data: S) => Promise<T>,
    data: S[],
    optional:
      | {
          keepSort?: boolean | undefined;
          length?: number | undefined;
          keys?: KeysOfT<T> | undefined;
        }
      | undefined
  ): Promise<PageModel<T>> {
    const firstObject: T = await asyncBuilderData(data[0]);
    const { keys, values } = PageModel.getPageParameters(
      firstObject,
      data,
      optional
    );

    const firstValues = PageModel.getValuesFromOneObject<T>(keys, firstObject);
    if (firstValues.length > 0) {
      values.push(firstValues);
    }

    return new PageModel({ keys, values }, 1);
  }

  static oneItemPageSync<T extends object, S>(
    builderData: (data: S) => T,
    data: S[],
    optional:
      | { keys?: KeysOfT<T> | undefined; length?: number | undefined }
      | undefined
  ): PageModel<T> {
    const firstObject: T = builderData(data[0]);
    const { keys, values } = PageModel.getPageParameters(
      firstObject,
      data,
      optional
    );

    const firstValues = PageModel.getValuesFromOneObject<T>(keys, firstObject);
    if (firstValues.length > 0) {
      values.push(firstValues);
    }

    return new PageModel({ keys, values }, 1);
  }

  private static getPageParameters<T extends object, S>(
    firstObject: T,
    data: (S | T)[],
    optional?: { length?: number; keys?: KeysOfT<T> }
  ): { length: number; keys: KeysOfT<T>; values: ValuesType<T> } {
    const keys = PageModel.getObjectKeys(firstObject, optional);

    const values: ValuesType<T> = [];

    const length = optional?.length ?? data.length;
    return { length, keys, values };
  }

  private static getObjectKeys<T extends object>(
    object: T,
    optional?: { keys?: KeysOfT<T> }
  ): KeysOfT<T> {
    return optional?.keys ?? (Object.keys(object) as KeysOfT<T>);
  }

  private static getValuesFromOneObject<T extends object>(
    keys: KeysOfT<T>,
    last?: T
  ): any[] {
    if (!last) return [];
    const lastValues: any[] = [];
    for (const key of keys) {
      lastValues.push(last[key]);
    }
    return lastValues;
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
