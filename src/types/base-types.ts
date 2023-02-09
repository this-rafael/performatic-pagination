/**
 * OneItemValueType<T> is the type of the values of an object T
 */
export type OneItemValueType<T> = T[keyof T][];

/**
 * ValuesType<T> is the type of the values of an object T
 */
export type ValuesType<T> = OneItemValueType<T>[];

/**
 *  KeysOfT<T> is the type of the keys of an object T
 */
export type KeysOfT<T> = (keyof T)[];

/**
 * PageProperties<T> is the type of the properties of a page
 */
export type PageProperties<T extends object> = {
  keys: KeysOfT<T>;

  values: ValuesType<T>;
}

/**
 * BuildOptionalData<T> is the type of the optional data to build a page model
 */
export type BuildOptionalData<T> = {
  keys?: KeysOfT<T>;
  length?: number;
};
