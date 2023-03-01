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

const main = async () => {
  const data = generateAData(10);

  console.log('dATa' , data)

  const page = await new AsyncFactoryPageModelBuilder<A, ADerivado>(
    async (a) => {
      await delay(1000);
      return map(a);
    },
    data
  ).build();

  console.log(page.asList);
};

main();
