import { PerformaticPaginationModel } from "./core/performatic-pagination.model";
import { AsyncFactoryPageModelBuilder } from "./helpers/async-factory-page.model";

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
  await delay(1000);
  return map(a);
};

const main = async () => {
  const total = 14;
  const data = [
    { id: 0, name: "name 0" },
    { id: 1, name: "name 1" },
    { id: 2, name: "name 2" },
    { id: 3, name: "name 3" },
    { id: 4, name: "name 4" },
    { id: 5, name: "name 5" },
    { id: 6, name: "name 6" },
    { id: 7, name: "name 7" },
    { id: 8, name: "name 8" },
    { id: 9, name: "name 9" },
    { id: 10, name: "name 10" },
    { id: 11, name: "name 11" },
    { id: 12, name: "name 12" },
    { id: 13, name: "name 13" },
  ];

  const take = 13;
  const skip = 12;

  const pp = await PerformaticPaginationModel.fromAsyncFactory({
    data,
    asyncFactory,
    total,
    skip,
    take,
  });

  console.log(pp.asList);
};

main();
