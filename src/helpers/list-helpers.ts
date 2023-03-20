export class ListHelper<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  public mapAndCount<U>(mapper: (item: T, index: number) => U): {
    data: U[];
    count: number;
  } {
    const data = this.data.map((item: T, index): U => {
      return mapper(item, index);
    });

    return { data, count: data.length };
  }

  public async map<U>(
    mapper: (item: T, index: number) => Promise<U>
  ): Promise<{ data: U[]; count: number }> {
    const data = this.data.map(async (item: T, index: number): Promise<U> => {
      return mapper(item, index);
    });

    return {
      data: await Promise.all(data),
      count: data.length,
    };
  }
}
