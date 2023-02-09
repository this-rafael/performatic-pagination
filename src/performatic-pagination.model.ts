/* eslint-disable max-params-no-constructor/max-params-no-constructor */
import { PageModel, PageProperties } from "./page.model";

export interface PerformaticPaginationFromDataBuilder<T extends object> {
  total: number;
  take: number;
  skip: number;
  page: {
    data: PageProperties<T>;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class PerformaticPaginationModel<T extends object> {
  /**
   * Total of items listed
   *
   * @type {number}
   * @memberof PerformaticPaginationModel
   */
  readonly total: number;

  /**
   * Number of items to take in the list (limit)
   *
   * @type {number}
   * @memberof PerformaticPaginationModel
   */
  readonly take: number;

  /**
   * Number of items to skip in the list (offset)
   *
   * @type {number}
   * @memberof PerformaticPaginationModel
   */
  readonly skip: number;

  /**
   * Current Page of items
   *
   * @type {PageModel<T>}
   * @memberof PerformaticPaginationModel
   */
  readonly page: PageModel<T>;

  /**
   * Creates an instance of PerformaticPaginationModel.
   *
   * @param {PageModel<T>} data
   * @param {number} total
   * @param {number} take
   * @param {number} skip
   * @memberof PerformaticPaginationModel
   */
  constructor(data: PageModel<T>, total: number, take: number, skip: number) {
    this.total = total;
    this.take = take;
    this.skip = skip;
    this.page = data;
  }

  /**
   * Factory method to create a PerformaticPaginationModel from a list of objects
   * and a builder function
   * @static
   * @template T extends object - Type of the object to be built
   * @template S - Type of the object to be used as origin
   * @param {number} total
   * @param {number} take
   * @param {number} skip
   * @param {S[]} data
   * @param {(origin: S) => T} builderData
   * @param {{
   *       keys?: (keyof T)[]
   *     }} [optional]
   * @return {*}  {PerformaticPaginationModel<T>}
   * @memberof PerformaticPaginationModel
   */
  static fromBuilders<T extends object, S>(
    total: number,
    take: number,
    skip: number,
    data: S[],
    builderData: (origin: S) => T,
    optional?: {
      keys?: (keyof T)[];
    }
  ): PerformaticPaginationModel<T> {
    return new PerformaticPaginationModel(
      PageModel.fromBuilderData(builderData, data, {
        keys: optional?.keys,
        length: take,
      }),
      total,
      take,
      skip
    );
  }

  /**
   * Factory method to create a PerformaticPaginationModel from a list of objects
   * and a builder asyncronous function (Promise)
   *
   * @static
   * @template S - Type of the object to be used as origin
   * @template T - Type of the object to be built
   * @param {number} total
   * @param {S[]} data
   * @param {(origin: S) => Promise<T>} asyncBuilderData - Asyncronous function to build the object
   * @param {number} [take]
   * @param {number} [skip]
   * @param {{
   *       keys?: (keyof T)[]
   *     }} [optional]
   * @return {*}  {Promise<PerformaticPaginationModel<T>>}
   * @memberof PerformaticPaginationModel
   */
  static async fromAsyncBuilder<S = any, T extends object = any>(
    total: number,
    data: S[],
    asyncBuilderData: (origin: S) => Promise<T>,
    take?: number,
    skip?: number,
    optional?: {
      keys?: (keyof T)[];
    }
  ): Promise<PerformaticPaginationModel<T>> {
    const takeValue = take ?? total;

    return new PerformaticPaginationModel(
      await PageModel.fromAsyncBuilderData(asyncBuilderData, data, {
        length: takeValue,
        keys: optional?.keys,
      }),
      total,
      take ?? total,
      skip ?? 0
    );
  }

  static fromData<T extends object>(
    data: PerformaticPaginationFromDataBuilder<T>
  ): PerformaticPaginationModel<T> {
    return new PerformaticPaginationModel<T>(
      new PageModel<T>(data.page.data, data.take),
      data.total,
      data.take,
      data.skip
    );
  }

  /**
   * Factory method to create a PerformaticPaginationModel from a list of objects
   *
   * @static
   * @template T
   * @param {T[]} data
   * @param {number} total
   * @param {number} take
   * @param {number} skip
   * @param {{
   *       keys?: (keyof T)[]
   *     }} [optional]
   * @return {*}  {PerformaticPaginationModel<T>}
   * @memberof PerformaticPaginationModel
   */
  static build<T extends object>(
    data: T[],
    total: number,
    take: number,
    skip: number,
    optional?: {
      keys?: (keyof T)[];
    }
  ): PerformaticPaginationModel<T> {
    return new PerformaticPaginationModel(
      PageModel.factory<T>(data, {
        keys: optional?.keys,
        length: take,
      }),
      total,
      take,
      skip
    );
  }

  /**
   * Returns the item at the specified index
   *
   * @param {number} index
   * @return {*}  {T}
   * @memberof PerformaticPaginationModel
   */
  public at(index: number): T {
    return this.page.at(index);
  }

  /**
   * Map the current page to a new page
   *
   * @template S - Type of the new page
   * @param {(value: T, index: number) => S} callbackfn - Function to map the current page
   * @return {*}  {PerformaticPaginationModel<S>}
   * @memberof PerformaticPaginationModel
   */
  public map<S extends object = any>(
    callbackfn: (value: T, index: number) => S
  ): PerformaticPaginationModel<S> {
    // eslint-disable-next-line unicorn/no-array-callback-reference
    return new PerformaticPaginationModel(
      this.page.map((element, index) => callbackfn(element, index)),
      this.total,
      this.take,
      this.skip
    );
  }

  /**
   * Map the current page to a new page using an asyncronous function
   *
   * @template S- Type of the new page
   * @param {(value: T, index: number) => Promise<S>} callbackfn - Asyncronous function to map the current page
   * @return {*}  {Promise<PerformaticPaginationModel<S>>}
   * @memberof PerformaticPaginationModel
   */
  public async asyncMap<S extends object = any>(
    callbackfn: (value: T, index: number) => Promise<S>
  ): Promise<PerformaticPaginationModel<S>> {
    const mappedData = await this.page.asyncMap((element, index) =>
      callbackfn(element, index)
    );
    return new PerformaticPaginationModel(
      mappedData,
      this.total,
      this.take,
      this.skip
    );
  }

  /**
   * Returns the keys of all objects in the page
   *
   * @readonly
   * @type {string[]}
   * @memberof PerformaticPaginationModel
   */
  public get keys(): string[] {
    return this.page.getKeys() as string[];
  }

  /**
   * Returns the values of all objects in the page
   *
   * @readonly
   * @type {T[keyof T][][]}
   * @memberof PerformaticPaginationModel
   */
  public get values(): T[keyof T][][] {
    return this.page.getValues() as T[keyof T][][];
  }

  /**
   * Returns the number of items in the page
   *
   * @readonly
   * @type {number}
   * @memberof PerformaticPaginationModel
   */
  public get count(): number {
    return this.page.length;
  }

  /**
   * Returns the page as a list of objects
   *
   * @readonly
   * @type {T[]}
   * @memberof PerformaticPaginationModel
   */
  public get asList(): T[] {
    return this.page.asList;
  }
}
