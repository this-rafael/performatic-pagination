export class ListHelper<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  public mapAndCount<U>(mapper: (item: T, index: number) => U): {
    data: U[];
    count: number;
  } {
    let count = 0;
    const data = this.data.map((item: T, index): U => {
      count += 1;
      return mapper(item, index);
    });

    return { data, count };
  }

  public mapAndCountAsync<U>(
    mapper: (item: T, index: number) => Promise<U>
  ): Promise<{ data: U[]; count: number }> {
    let count = 0;
    const data = this.data.map(async (item: T, index: number): Promise<U> => {
      count += 1;
      return mapper(item, index);
    });

    return Promise.all(data).then((data: U[]) => {
      return { data, count };
    });
  }
}
