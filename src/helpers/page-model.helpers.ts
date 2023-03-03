import { PageModel } from "../core/page.model";
import { KeysOf, OneItemValueType, ValuesType } from "../types/base-types";

export class AtHelper<T extends object> {
  constructor(private readonly page: PageModel<T>) {}

  public at(index: number): T {
    if (index < 0) {
      // eslint-disable-next-line no-param-reassign
      index = this.page.data.values.length + index;
    }
    const item = {} as T;

    if (!this.page.data.values[index]) {
      const values = this.page.data.values;
      const valuelength = values.length;
      console.warn(
        "WARNING",
        new Error(`
        You are trying to access an inexistent index
        > index: ${index}
        > length: ${valuelength}
        > keys: ${this.page.data.keys}
        > values: ${JSON.stringify(values)}}
        The last available index is: ${valuelength - 1}
        And item is ${values[valuelength - 1]}

      `)
      );

      return item;
    }
    for (const [i, key] of this.page.data.keys.entries()) {
      item[key] = this.page.data.values[index][i];
    }
    return item;
  }
}

export class MapHelper<T extends object, S extends object = any> {
  constructor(private readonly page: PageModel<T>) {}

  /**
   * Map the page to another type of page with the given callback function
   *
   * @template S - Type of the mapped page
   * @param {(value: T, index: number) => S} callbackfn - Callback function to map the page
   * @return {*}  {PageModel<S>}
   * @memberof PageModel
   */
  public map(callbackfn: (value: T, index: number) => S): PageModel<S> {
    if (this.page.isEmpty) {
      return new PageModel<S>({ keys: [], values: [] }, 0);
    }

    const { firstItem, mappedValues } = this.getFirstItemAndMappedValues<S>();
    const firstMappedItem: S = callbackfn(firstItem, 0);
    const keys = this.getFirstObjectKeysAndPushFirstItemToMappedValues<S>(
      firstMappedItem,
      mappedValues
    );

    for (let index: number = 1; index < this.page.length; index += 1) {
      const item = this.page.at(index);
      const mappedItem: S = callbackfn(item, index);
      const values = Object.values(mappedItem);
      mappedValues.push(values);
    }

    return new PageModel<S>({ keys, values: mappedValues }, this.page.length);
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
  public async asyncMap(
    callbackfn: (value: T, index: number) => Promise<S>
  ): Promise<PageModel<S>> {
    const { firstItem, mappedValues } = this.getFirstItemAndMappedValues<S>();
    const firstMappedItem: S = await callbackfn(firstItem, 0);
    const keys = this.getFirstObjectKeysAndPushFirstItemToMappedValues<S>(
      firstMappedItem,
      mappedValues
    );

    for (let index: number = 1; index < this.page.length; index += 1) {
      const item = this.page.at(index);
      const mappedItem: S = await callbackfn(item, index);
      const values = Object.values(mappedItem);
      mappedValues.push(values);
    }

    return new PageModel<S>({ keys, values: mappedValues }, this.page.length);
  }

  private getFirstObjectKeysAndPushFirstItemToMappedValues<
    S extends object = any
  >(firstMappedItem: S, mappedValues: S[keyof S][][]): (keyof S)[] {
    const firstValues = Object.values(firstMappedItem);
    mappedValues.push(firstValues);
    const keys = Object.keys(firstMappedItem) as (keyof S)[];
    return keys;
  }

  private getFirstItemAndMappedValues<S extends object = any>(): {
    firstItem: T;
    mappedValues: ValuesType<S>;
  } {
    const mappedValues = [] as ValuesType<S>;
    const firstItem = this.page.at(0);
    return { firstItem, mappedValues };
  }

  catcher(catcher: any): void {
    console.error(catcher);

    throw catcher;
  }
}

export class BuildOneItemPageModelHelper<T extends object, S> {
  constructor(
    private readonly data: S[],
    private readonly optional?: { keys?: KeysOf<T>; length?: number }
  ) {}

  public async getFirstItemAsync(
    asyncBuilderData: (data: S) => Promise<T>
  ): Promise<PageModel<T>> {
    this.validateData();
    const item: T = await asyncBuilderData(this.data[0]);
    return this.getItemPage(item);
  }

  public getFirstItemSync(builderData: (data: S) => T): PageModel<T> {
    this.validateData();
    const item: T = builderData(this.data[0]);
    return this.getItemPage(item);
  }

  g;

  private validateData(): void {
    if (!this.data[0]) {
      throw new Error("The data array is empty");
    }
  }

  private IDENTITY_FUNCTION = <T>(item: T): T => item;

  private getItemPage(item: T): PageModel<T> {
    const pageParametersHelper = new GetPageParametersHelper<T>(
      item,
      { length: 1 },
      this.optional
    );
    const { keys, values } = pageParametersHelper.parameters;

    const objectValues = pageParametersHelper.getValuesFromItem(keys);

    values.push(objectValues);

    return new PageModel<T>({ keys, values }, 1);
  }
}

export class GetPageParametersHelper<T extends object> {
  constructor(
    private readonly object: T,
    private readonly data: { length: number },
    private readonly optional?: { keys?: KeysOf<T>; length?: number }
  ) {}

  get parameters(): {
    length: number;
    values: ValuesType<T>;
    keys: KeysOf<T>;
  } {
    const length = this.optional?.length ?? this.data.length;
    const values: ValuesType<T> = [];
    return {
      length,
      values,
      keys: this.keys,
    };
  }

  get keys(): KeysOf<T> {
    return this.optional?.keys ?? (Object.keys(this.object) as KeysOf<T>);
  }

  getValuesFromItem(keys: KeysOf<T>): OneItemValueType<T> {
    if (!this.object || keys.length === 0) return [];

    const values: OneItemValueType<T> = [];
    for (const key of keys) {
      values.push(this.object[key]);
    }
    return values;
  }
}
