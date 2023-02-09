import { KeysOfT, PageProperties } from "../types/base-types";

/**
 * This interface is used to build a PerformaticPaginationModel in factory called fromSyncFactory {@see PerformaticPaginationModel}
 *
 * @export
 * @interface PerformaticPaginationModelFromSyncFactoryBuilder
 * @template T
 * @template S
 */
export interface PerformaticPaginationModelFromSyncFactoryBuilder<
  T extends object,
  S
> {
  /**
   * Indicates the max itens of the element
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  total: number;

  /**
   * Represents the original data will be mapped usign {@link factory}
   *
   * @type {S[]}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  data: S[];

  /**
   * Its an function that will be used to map the {@link data} to the {@link T} where T is the type of the page
   *
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  factory: (origin: S) => T;

  /**
   * Indicates the number of elements requested for that page if is empty is replaced by the total
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  take?: number;

  /**
   * Indicates the number of skipped elements for that page
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  skip?: number;

  /**
   * Optional data to build the page
   * keys will be used to build the page object keys can be passed, to decrease the number of interactions made, improving performance
   *
   * @type {{
   *     keys?: KeysOfT<T>;
   *   }}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  optional?: {
    keys?: KeysOfT<T>;
  };
}

/**
 * This interface is used to build a PerformaticPaginationModel in factory called fromAsyncFactory {@see PerformaticPaginationModel}
 *
 * @export
 * @interface PerformaticPaginationModelAsyncFactoryBuilder
 * @template T
 * @template S
 */
export interface PerformaticPaginationModelAsyncFactoryBuilder<
  T extends object,
  S
> {
  /**
   * Indicates the max itens of the element
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  total: number;

  /**
   * Represents the original data will be mapped usign {@link factory}
   *
   * @type {S[]}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  data: S[];

  /**
   * Its an function that will be used to map the {@link data} to the {@link T} where T is the type of the page
   *
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  asyncFactory: (origin: S) => Promise<T>;
  /**
   * Indicates the number of elements requested for that page if is empty is replaced by the total
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  take?: number;

  /**
   * Indicates the number of skipped elements for that page
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  skip?: number;

  /**
   * Optional data to build the page
   * keys will be used to build the page object keys can be passed, to decrease the number of interactions made, improving performance
   *
   * @type {{
   *     keys?: KeysOfT<T>;
   *   }}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  optional?: {
    keys?: KeysOfT<T>;
  };
}

export interface PerformanticPaginationModelFromEntriesBuilder<
  T extends object
> {
  /**
   * Indicates the max itens of the element
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  total: number;
  /**
   * Indicate the elements to be transformed in a page
   *
   * @type {T[]}
   * @memberof PerformanticPaginationModelFromEntriesBuilder
   */
  entries: T[];
  /**
   * Indicates the number of elements requested for that page if is empty is replaced by the total
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  take?: number;

  /**
   * Indicates the number of skipped elements for that page
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  skip?: number;

  /**
   * Optional data to build the page
   * keys will be used to build the page object keys can be passed, to decrease the number of interactions made, improving performance
   *
   * @type {{
   *     keys?: KeysOfT<T>;
   *   }}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  optional?: {
    keys?: KeysOfT<T>;
  };
}

export interface PerformaticPaginationFromDataBuilder<T extends object> {
  /**
   * Indicates the max itens of the element
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  total: number;
  /**
   * Indicates the number of elements requested for that page if is empty is replaced by the total
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  take?: number;

  /**
   * Indicates the number of skipped elements for that page
   *
   * @type {number}
   * @memberof PerformaticPaginationModelFromSyncFactoryBuilder
   */
  skip?: number;

  /**
   * Indicate a page model
   *
   * @type {{
   *     data: PageProperties<T>;
   *   }}
   * @memberof PerformaticPaginationFromDataBuilder
   */
  page: {
    data: PageProperties<T>;
  };
}
