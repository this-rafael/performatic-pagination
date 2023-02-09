import { PerformaticPaginationModel } from "./index";

type TestModel = {
  id: number;
  name: string;
};

type TestModel2 = {
  id: number;
  name: string;
  id2: number;
};

const testModel: TestModel[] = [
  { id: 1, name: "Test 1" },
  { id: 2, name: "Test 2" },
  { id: 3, name: "Test 3" },
  { id: 4, name: "Test 4" },
  { id: 5, name: "Test 5" },
];

const merchants = [
  {
    id: "e421bcd8-a18a-11ed-9730-0242ac160002",
    daasEntityDbId: 31,
    document: "07699496000182",
    documentType: "BR_CNPJ",
    email: "mafaraujo2003@yahoo.com.br",
    fantasyName: "Rei do Mate - Faria Lima 1622",
    socialName: "M&N Cafeteria Ltda-ME",
    name: "Rei do Mate - Faria Lima 1622",
    website: "www.reidomate.com.br",
    primaryKey: "52n",
  },
  {
    id: "e431ebc7-a18a-11ed-9730-0242ac160002",
    daasEntityDbId: 32,
    document: "24534873000142",
    documentType: "BR_CNPJ",
    email: "amaralpioto@gmail.com",
    fantasyName: "Rei do Mate - Hospital Santa Helena - Mate alimentos",
    socialName: "MATE ALIMENTOS LTDA - ME",
    name: "Rei do Mate - Hospital Santa Helena - Mate alimentos",
    website: "www.reidomate.com.br",
    primaryKey: "53n",
  },
  {
    id: "e464d838-a18a-11ed-9730-0242ac160002",
    daasEntityDbId: 35,
    document: "24534873000142",
    documentType: "BR_CNPJ",
    email: "amaralpioto@gmail.com",
    fantasyName: "Rei do Mate - Hospital Santa Helena - Mate alimentos",
    socialName: "MATE ALIMENTOS LTDA - ME",
    name: "Rei do Mate - Hospital Santa Helena - Mate alimentos",
    website: "www.reidomate.com.br",
    primaryKey: "56n",
  },
  {
    id: "2c31cfbb-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 40,
    document: "11035653000122",
    documentType: "BR_CNPJ",
    email: "eduardo.ribeiro@dominos.com.br",
    fantasyName: "Dominos Vila Isabel",
    socialName: "VILA CALABRIA ALIMENTOS LTDA",
    name: "Dominos Vila Isabel",
    website: "www.dominos.com.br",
    primaryKey: "159n",
  },
  {
    id: "aa780ee0-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 374,
    document: "17261661009049",
    documentType: "BR_CNPJ",
    email: "santanaparque.bz81@outback.com.br",
    fantasyName: "BZ81 Abbraccio - Santana",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ81 Abbraccio - Santana",
    website: "",
    primaryKey: "347n",
  },
  {
    id: "aa8452bb-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 375,
    document: "17261661011612",
    documentType: "BR_CNPJ",
    email: "tijuca.ab14@abbracciorestaurante.com.br",
    fantasyName: "AB14 - Abbraccio Tijuca",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "AB14 - Abbraccio Tijuca",
    website: "",
    primaryKey: "348n",
  },
  {
    id: "aa929ecc-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 376,
    document: "17261661003512",
    documentType: "BR_CNPJ",
    email: "norteshopping.bz16@outback.com.br",
    fantasyName: "BZ16 Outback Steakhouse - Norte Shopping",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ16 Outback Steakhouse - Norte Shopping",
    website: "",
    primaryKey: "349n",
  },
  {
    id: "aa9df433-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 377,
    document: "17261661009634",
    documentType: "BR_CNPJ",
    email: "spmarket.bz82@outback.com.br",
    fantasyName: "BZ82 Outback - Shop Sp Market",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ82 Outback - Shop Sp Market",
    website: "",
    primaryKey: "350n",
  },
  {
    id: "aaa9dc96-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 378,
    document: "17261661009634",
    documentType: "BR_CNPJ",
    email: "spmarket.bz82@outback.com.br",
    fantasyName: "BZ82 Aussie Grill - Shop Sp Market",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ82 Aussie Grill - Shop Sp Market",
    website: "",
    primaryKey: "351n",
  },
  {
    id: "aab5c241-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 379,
    document: "17261661003601",
    documentType: "BR_CNPJ",
    email: "tijuca.bz17@outback.com.br",
    fantasyName: "BZ17 Outback Steakhouse - Tijuca",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ17 Outback Steakhouse - Tijuca",
    website: "",
    primaryKey: "352n",
  },
  {
    id: "aac3f52e-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 380,
    document: "17261661011370",
    documentType: "BR_CNPJ",
    email: "niteroi.ab15@abbracciorestaurante.com.br",
    fantasyName: "AB15 - Abbraccio Plaza Niterói",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "AB15 - Abbraccio Plaza Niterói",
    website: "",
    primaryKey: "353n",
  },
  {
    id: "aad25208-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 381,
    document: "17261661004160",
    documentType: "BR_CNPJ",
    email: "goiania.bz18@outback.com.br",
    fantasyName: "BZ18 Outback Steakhouse - Flamboyant Center",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ18 Outback Steakhouse - Flamboyant Center",
    website: "",
    primaryKey: "354n",
  },
  {
    id: "aadddaad-a18b-11ed-9730-0242ac160002",
    daasEntityDbId: 382,
    document: "17261661004160",
    documentType: "BR_CNPJ",
    email: "goiania.bz18@outback.com.br",
    fantasyName: "BZ18 Abbraccio - AB in Flamboyant Center",
    socialName: "Outback Steakhouse Restaurantes Brasil S.A",
    name: "BZ18 Abbraccio - AB in Flamboyant Center",
    website: "",
    primaryKey: "355n",
  },
  {
    id: "d43def11-a18c-11ed-9730-0242ac160002",
    daasEntityDbId: 176,
    document: "35554315000912",
    documentType: "BR_CNPJ",
    email: "shbarreiro.bobsmg@gmail.com",
    fantasyName: "BOBS - VIA SHOPPING BARREIRO",
    socialName: "",
    name: "BOBS - VIA SHOPPING BARREIRO",
    website: "https://www.bobs.com.br/",
    primaryKey: "618n",
  },
  {
    id: "d457d327-a18c-11ed-9730-0242ac160002",
    daasEntityDbId: 178,
    document: "10222676005819",
    documentType: "BR_CNPJ",
    email: "bobs.ayrtonsenna@gmail.com",
    fantasyName: "Bobs - Posto Shell Ayrton Senna",
    socialName: "",
    name: "Bobs - Posto Shell Ayrton Senna",
    website: "https://www.bobs.com.br/",
    primaryKey: "620n",
  },
];

const main = async () => {
  const page = await PerformaticPaginationModel.fromAsyncBuilder(
    16,
    merchants,
    async (response) => {
      return {
        current: new Date().getTime(),
        ...response,
      };
    },
    15,
    0
  );

  console.log(page.asList);
};

main();
