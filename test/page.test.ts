import { PerformaticPaginationModel } from "../src/index";

type TestObject = {
  id: number;
  name: string;
};

const TestObject = (): TestObject[] => {
  let data: TestObject[] = [];

  for (let i = 0; i < 2; i++) {
    data.push({
      id: i,
      name: `name ${new Date().getTime()}`,
    });
  }

  return data;
};

const main = async () => {
  const originalData = TestObject();
  const page = PerformaticPaginationModel.build(originalData, 100, 13, 0);
  console.log(page)

  console.log(page.asList);
};

main();
