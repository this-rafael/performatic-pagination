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
export type KeysOf<T> = (keyof T)[];

/**
 * PageProperties<T> is the type of the properties of a page
 */
export type PageProperties<T extends object> = {
  keys: KeysOf<T>;

  values: ValuesType<T>;
};

/**
 * BuildOptionalData<T> is the type of the optional data to build a page model
 */
export type BuildOptionalData<T> = {
  keys?: KeysOf<T>;
  length?: number;
};
