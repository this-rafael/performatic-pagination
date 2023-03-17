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
  const user = {
    ids: {
      internalId: 1,
      externalId: "4a3be3c8-4114-4cbc-8da7-5b5f1c8792ae",
    },
    names: {
      firstName: "John",
      surname: "Doe",
    },
    contact: {
      email: "any@email.com",
      phone: "123456789",
    },
  };

  const users = [user];

  const total = 1;
  const take = 1;
  const skip = 0;

  const pp = PerformaticPaginationModel.fromEntites({
    total,
    entries: users,
    take,
    skip,
  });

  console.log(JSON.stringify(pp));
  console.log(pp.asList);
};

main();
