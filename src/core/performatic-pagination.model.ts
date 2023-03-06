import {
  PerformaticPaginationModelFromSyncFactoryBuilder,
  PerformaticPaginationModelAsyncFactoryBuilder,
  PerformanticPaginationModelFromEntriesBuilder,
  PerformaticPaginationFromDataBuilder,
} from "../interfaces/performatica-pagination-model.builders.interface";
import { PageModel } from "./page.model";

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
   * Creates an instance of PerformaticPaginationModel.
   * using a factory mapping method, this method create an instance of PerformaticPaginationModel mapping each original data item using
   * the factory method.
   *
   * This method considers that the real size of the page will be a number between 0 and the total number of items.
   * - If the sum between take and skip is a number greater than the total, the size will be considered as the difference between this sum minus the total
   * - If the sum between take and skip is a number less than the total, the size will be considered
   *
   *
   * @static
   * @template S The type of the original data
   * @template T The new type of the original data
   * @param {PerformaticPaginationModelFromSyncFactoryBuilder<T, S>} builder
   * @return {*}  {PerformaticPaginationModel<T>}
   * @memberof PerformaticPaginationModel
   */
  static fromSyncFactory<S = any, T extends object = any>(
    builder: PerformaticPaginationModelFromSyncFactoryBuilder<T, S>
  ): PerformaticPaginationModel<T> {
    const { total, data, factory: builderData, take, skip, optional } = builder;

    const takeValue = take ?? total;
    const skipValue = skip ?? 0;

    const skipPlusTake = skipValue + takeValue;

    const pageLength = skipPlusTake > total ? skipPlusTake - total : take;

    return new PerformaticPaginationModel(
      PageModel.fromSyncFactory(builderData, data, {
        keys: optional?.keys,
        length: pageLength,
      }),
      total,
      takeValue,
      skipValue
    );
  }

  /**
   * This os asyncronous factory method creates a new instance of PerformaticPaginationModel.
   * using a factory mapping method, this method create an instance of PerformaticPaginationModel mapping each original data item using
   * the async callback function
   *
   * This method considers that the real size of the page will be a number between 0 and the total number of items.
   * - If the sum between take and skip is a number greater than the total, the size will be considered as the difference between this sum minus the total
   * - If the sum between take and skip is a number less than the total, the size will be considered
   *
   * @static
   * @template S - the type of the original data
   * @template T - the type of the returned data
   * @param {PerformaticPaginationModelAsyncFactoryBuilder<T, S>} builder
   * @return {*}  {Promise<PerformaticPaginationModel<T>>}
   * @memberof PerformaticPaginationModel
   */
  static async fromAsyncFactory<S = any, T extends object = any>(
    builder: PerformaticPaginationModelAsyncFactoryBuilder<T, S>
  ): Promise<PerformaticPaginationModel<T>> {
    const { total, data, asyncFactory, take, skip, optional } = builder;
    const takeValue = take ?? total;
    const skipValue = skip ?? 0;

    const skipPlusTake = skipValue + takeValue;

    // use pendulum to calculate the page length

    return new PerformaticPaginationModel(
      await PageModel.fromAsyncFactory(asyncFactory, data, {
        keys: optional?.keys,
      }),
      total,
      takeValue,
      skipValue
    );
  }

  /**
   * This factory method creates a new instance of PerformaticPaginationModel.
   * @param data The data to be used to create the pagination model.
   *
   * This method considers that the real size of the page will be a number between 0 and the total number of items.
   * - If the sum between take and skip is a number greater than the total, the size will be considered as the difference between this sum minus the total
   * - If the sum between take and skip is a number less than the total, the size will be considered
   *
   * @static
   * @template T - The type of the items in the page.
   * @param {PerformanticPaginationModelFromEntriesBuilder<T>} builder
   * @return {*}  {PerformaticPaginationModel<T>}
   * @memberof PerformaticPaginationModel
   */
  static fromEntriesData<T extends object>(
    builder: PerformanticPaginationModelFromEntriesBuilder<T>
  ): PerformaticPaginationModel<T> {
    const { total, entries, take, skip, optional } = builder;

    const takeValue = take ?? total;
    const skipValue = skip ?? 0;

    const skipPlusTake = skipValue + takeValue;

    const pageLength = skipPlusTake > total ? skipPlusTake - total : take;

    return new PerformaticPaginationModel(
      PageModel.fromEntriesData<T>(entries, {
        keys: optional?.keys,
        length: pageLength,
      }),
      total,
      takeValue,
      skipValue
    );
  }

  /**
   * This factory method creates a new instance of the PerformaticPaginationModel class.
   * the parameter data is an object like the PerformaticPaginationModel class.
   *  So if you want to create a new instance of the PerformaticPaginationModel class, you can use this method.
   *
   *
   * @static
   * @template T
   * @param {PerformaticPaginationFromDataBuilder<T>} data - pbject like the PerformaticPaginationModel class.
   * @return {*}  {PerformaticPaginationModel<T>}
   * @memberof PerformaticPaginationModel
   */
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
   * Returns the element at the specified index.
   *
   * @example: If the original PerformaticPaginationModel has 5 elements, created by a given T {id: number, name: string} and the index is 2, the resulting element will be {id: number, name: string}.
   *
   *
   *
   * @param {number} index - The index of the element to return if negative, the index is calculated from the end of the array
   * @return {*}  {T}
   * @memberof PerformaticPaginationModel
   */
  public at(index: number): T {
    return this.page.at(index);
  }

  /**
   * Returns a new instance of PerformaticPaginationModel
   * this method applies the given function to each element of the original model.
   * The result of the function is the new element of the new PerformaticPaginationModel.
   *
   * @example: If the original PerformaticPaginationModel has 5 elements, created by a given T {id: number, name: string} and
   * the new type, get any data in for eg: get fullName  and then return the new PerformaticPaginationModel with the new type {id: number, name: string, fullName: string}
   * const mappedModel = originalModel.map(async (element, index) => {
   *    const fullName = getFullName(element.id);
   *    return {id: element.id, name: element.name, fullName};
   * })
   * @template S - The type of the new model
   * @param {(value: T, index: number) => S} callbackfn - The function to apply to each element of the original model
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
   * Returns a new instance of PerformaticPaginationModel
   * this method applies the given async function to each element of the original model.
   * The result of the function is the new element of the new model.
   *
   * @example: If the original PerformaticPaginationModel has 5 elements, created by a given T {id: number, name: string} and
   * the new type, get any data in asyncronously for eg: get fullName  and then return the new PerformaticPaginationModel with the new type {id: number, name: string, fullName: string}
   *
   * const mappedModel = await originalModel.map(async (element, index) => {
   *    const fullName = await getFullName(element.id); // note asyncronously call
   *    return {id: element.id, name: element.name, fullName};
   * })
   *
   * @template S - The type of the elements of the original model
   * @param {(value: T, index: number) => Promise<S>} callbackfn - The async function to call on each element of the original model
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

  filterAsList(callbackfn: (value: T, index: number) => boolean): T[] {
    return this.page.filterAsList((element, index) =>
      callbackfn(element, index)
    );
  }

  filter(
    callbackfn: (value: T, index: number) => boolean
  ): PerformaticPaginationModel<T> {
    return new PerformaticPaginationModel(
      this.page.filter((element, index) => callbackfn(element, index)),
      this.total,
      this.take,
      this.skip
    );
  }

  /**
   * Returns the keys of all objects in the page
   *
   * @example: If the T is an object like { id: number, name: string } the keys will be ['id', 'name']
   *
   * @type {string[]}
   * @memberof PerformaticPaginationModel
   */
  public get keys(): string[] {
    return this.page.getKeys() as string[];
  }

  /**
   * Returns the values of all objects in the page
   *
   * @example: If the T is an object like { id: number, name: string } and have 2 items in the page, eg: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
   * the values will be [[1, 'John'], [2, 'Jane']]
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
   * @example: If the T is an object like { id: number, name: string } return and list of objects [{ id: 1, name: 'John' }, { id: 2, name: 'Jane
   *
   * @readonly
   * @type {T[]}
   * @memberof PerformaticPaginationModel
   */
  public get asList(): T[] {
    return this.page.asList;
  }
}
