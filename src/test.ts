import { PerformaticPaginationModel } from "./core/performatic-pagination.model";
import { AsyncFactoryPageModelBuilder } from "./helpers/async-factory-page.model";
import { ListHelper } from "./helpers/list-helpers";

type A = {
  id: number;
  name: string;
};

type ADerivado = {
  id: number;
  name: string;
  createdAt: Date;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateAData = (count: number) => {
  const data: A[] = [];
  for (let i = 0; i < count; i++) {
    data.push({ id: i, name: `name ${i}` });
  }
  return data;
};

const map = (a: A): ADerivado => {
  return { ...a, createdAt: new Date() };
};

const asyncFactory = async (a: A): Promise<ADerivado> => {
  await delay(100);
  return map(a);
};

const main = async () => {
  const total = 14;
  const data = [{ id: 0, name: "name 0" }];

  const take = 13;
  const skip = 12;

  const pp = await PerformaticPaginationModel.fromAsyncFactory({
    data,
    asyncFactory,
    total,
    skip,
    take,
  });

  console.log(JSON.stringify(pp));
  console.log(pp.asList);
};

main();
