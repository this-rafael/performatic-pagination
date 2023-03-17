# Performatic Pagination

## Você sabia?

Você sabia que suas requests podem estar disperdiçando até 50% do tamanho do seu payload? Isso mesmo, o tamanho do seu payload pode ser reduzido em até 50% com a
implementação de paginação performática.
Imagine o cenario onde você responda para o cliente uma lista de clientes do tipo cliente (id, name, birthDate, email, externalId, createdAt, updatedAt, deletedAt) com um unico valor, exemplo:

> EXEMPLO A:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "birthDate": "1990-01-01",
    "email": "jonh.doe.@email.com",
    "externalId": "73f7ea98-f249-4b76-b85e-d08d86cc9782",
    "createdAt": "2019-01-01T00:00:00.000Z",
    "updatedAt": "2019-01-01T00:00:00.000Z",
    "deletedAt": null
  }
]
```

Podemos fazer uma simples contagem e observar que a contagem dos nomes de atributos é 8 e a numero de valores é 8, logo temos que para para um elemento temos em nossa resposta 8 atributos e 8 valores, vejamos o que acontece quando temos um array com 2 elementos:

> EXEMPLO B:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "birthDate": "1990-01-01",
    "email": "jonh.doe.@email.com",
    "externalId": "73f7ea98-f249-4b76-b85e-d08d86cc9782",
    "createdAt": "2019-01-01T00:00:00.000Z",
    "updatedAt": "2019-01-01T00:00:00.000Z",
    "deletedAt": null
  },
  {
    "id": 2,
    "name: "Jane Doe",
    "birthDate": "1990-01-01",
    "email": "jane.doe.@email.com",
    "externalId": "73f7ea98-f249-4b76-b85e-d08d86cc9783",
    "createdAt": "2019-01-01T00:00:00.000Z",
    "updatedAt": "2019-01-01T00:00:00.000Z",
    "deletedAt": "2019-01-01T00:00:00.000Z"
  }
]
```

Bem para este caso temos 2 elementos, cada um com 8 nomes de atributos e 8 valores, isso ilustra o problema, quando serializamos um objeto em json
ele por questões obivias mantém a sua estrutura chave-valor, entretanto quando temos um array de objetos, o json serializa cada objeto como um objeto independente, o que faz com que a gente tenha redundancia no nome dos atributos, se o array tiver 1000 elementos, teremos 1000 vezes o nome dos atributos, isso faz com que o tamanho do payload aumente consideravelmente, e isso pode ser resolvido com a implementação de paginação performática.

## O que esta biblioteca faz?

Resumidamente essa biblioteca serve para transformar um array de objetos em um objeto `PerformaticPaginationModel` que contém os atributos `total` indicando o numero total de elementos, `take` indicando o numero de elementos que foram retornados, `skip` indicando o numero de elementos que foram saltado por fim `page` que representa a pagina atual, sendo `page` o objeto que contém os elementos, sendo ele um objeto `PageModel` ele conta com os atributos: `keys` que representam as chaves que o objeto possui e `values` os valores de cada um dos elementos de um array, sendo assim o array mostrado anteriormente se tornaria algo como:

> EXEMPLO C:

```json
{
  "keys": [
    "id",
    "name",
    "birthDate",
    "email",
    "externalId",
    "createdAt",
    "updatedAt",
    "deletedAt"
  ],

  "values": [
    [
      1,
      "John Doe",
      "1990-01-01",
      "jonh.doe.@email.com",
      "73f7ea98-f249-4b76-b85e-d08d86cc9782",
      "2019-01-01T00:00:00.000Z",
      "2019-01-01T00:00:00.000Z",
      null
    ],
    [
      2,
      "Jane Doe",
      "1990-01-01",
      "jane.doe.@email.com",
      "73f7ea98-f249-4b76-b85e-d08d86cc9783",
      "2019-01-01T00:00:00.000Z",
      "2019-01-01T00:00:00.000Z",
      "2019-01-01T00:00:00.000Z"
    ]
  ]
}
```

Ou seja diferente de serializar um array de objetos, ao serializar o `PageModel` não temos redundancia de nomes de atributos, isso faz com que o tamanho do payload seja reduzido em até 50%, e isso é muito bom, pois o tamanho do payload é um dos fatores que mais influencia no tempo de resposta de uma request.

## Como usar?

> Essa biblioteca pode ser usa de 4 formas basicamente, seja para tipar um objeto json que se receba por exemplo numa request (fromData), ou para transformar um array de objetos em um objeto `PerformaticPaginationModel` (fromEntities), ou aplicar uma factory mapeando um array de objetos em outro e então construindo um objeto `PerformaticPaginationModel` de maneira sincrona (fromSyncFactory) ou assincrona (fromAsyncFactory).

### Construindo um PerformaticPaginationModel a partir de um objeto

Imagine o cenario onde você consome uma API que retorna um PerformaticPaginationModel por exemplo os dados que vão retornados são os mesmos do exemplo C, teriamos algo como:

```typescript
const response = await fetch("https://your-api.com/your-endpoint"); // return ok with status 200 and json is the same of example C
const object = await request.json(); // object is the same of example C but with type any
```

O problema é que o objeto `object` não é tipado, e por isso não conseguimos acessar os metodos disponiveis na classe `PerformaticPaginationModel`, podemos facilmente resolver isso com a função `fromData` que recebe um objeto qualquer e retorna um objeto `PerformaticPaginationModel` tipado, veja o exemplo:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";

const response = await fetch("https://your-api.com/your-endpoint"); // return ok with status 200 and json is the same of example C
const object = await request.json(); // object is the same of example C but with type any
const performaticPaginationModel = PerformaticPaginationModel.fromData(object); // performaticPaginationModel is a PerformaticPaginationModel
```

com a sintaxe acima podemos usar todos os metodos disponiveis na classe `PerformaticPaginationModel` sem problemas. Por exemplo caso queiramos mapear cada
registro criando um novo `PerformaticPaginationModel` com os atributos `id` e `name` teriamos algo como:

```typescript
const mappedPerformaticPagination = performaticPaginationModel.map((item) => ({
  id: item.id,
  name: item.name,
})); // have same itens of performaticPaginationModel but with only id and name
```

Claro este é apenas um exemplo do que pode ser feito, todos os metodos disponiveis na classe `PerformaticPaginationModel` podem ser usados.

### Construindo um PerformaticPaginationModel a partir de um array de objetos

O caso mais comum de utilização dessa biblioteca é quando queremos nos livrar da redundancia de nomes de atributos, e ao mesmo tempo queremos retorar uma consulta paginada entre valores de `skip` e `take`, para isso podemos usar a função `fromEntities` que recebe um objeto com os atributos `total`, `take`, `skip` e `entries` e retorna um objeto `PerformaticPaginationModel` tipado, veja o exemplo:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";

async function getUsers(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A

  return PerformaticPaginationModel.fromEntities({
    total,
    take,
    skip,
    entries: users,
  });
}
```

No exemplo passamos um array de objetos para a função `fromEntities` e ela retorna um objeto `PerformaticPaginationModel` tipado, isso acontece pois a Pagina `PageModel` é construida a partir do array.

Uma variação do codigo acima é passando uma objeto de propriedades opcionais keys que é um array de strings, com ele definimos quais atributos queremos que sejam retornados, veja o exemplo:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";

async function getUsers(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A

  return PerformaticPaginationModel.fromEntities({
    total,
    take,
    skip,
    entries: users,
    keys: ["id", "name"],
  });
}
```

### Construindo um PerformaticPaginationModel a partir de um array de objetos com uma factory sincrona

Esse cenario, reflete a seguinte situação, dado que você um array do tipo X sendo retornado pela sua fonte de dados, mas deseja retornar um objeto `PerformaticPaginationModel` do tipo Y, para isso podemos usar a função `fromSyncFactory` que recebe um objeto com os atributos `total`, `take`, `skip`, `data` e uma função que mapeia e constroi um objeto do tipo Y chamada `factory`.

Para o exemplo a seguir vamos considerar o modelo de dados do exemplo A `User` e que queremos mapear para o tipo `SimpleUser` que é um obejto com os atributos `id`, `externalId` e `name`, podemos fazer isso da seguinte forma:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";
import { Simple }

async function getUsers(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A



  return PerformaticPaginationModel.fromSyncFactory({
    total,
    take,
    skip,
    data: users,
    factory: (user) => ({
      id: user.id,
      externalId: user.externalId,
      name: user.name,
    }),
  });
}
```

Claro, também podemos usar o metodo acima para incluir novos atributos, por exemplo se quisessemos incluir o atributo firstName e surname, poderiamos fazer isso da seguinte forma:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";
import { SimpleUser2 } from "./simple-user2";

async function getUsers1(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A

  return PerformaticPaginationModel.fromSyncFactory({
    total,
    take,
    skip,
    data: users,
    factory: (user) => {
      const [firstName, ...surname] = user.name.split(" ");

      return {
        id: user.id,
        externalId: user.externalId,
        name: user.name,
        firstName,
        surname: surname.join(" "),
      };
    },
  });
}
```

E também poderiamos usar a opção `keys` para filtrar os atributos que queremos retornar, veja o exemplo abaixo onde retornamos apenas firstName e surname:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";
import { SimpleUser2 } from "./simple-user2";

async function getUsers(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A

  return PerformaticPaginationModel.fromSyncFactory({
    total,
    take,
    skip,
    data: users,
    options: {
      keys: ["firstName", "surname"],
    },
    factory: (user) => {
      const [firstName, ...surname] = user.name.split(" ");

      return {
        id: user.id,
        externalId: user.externalId,
        name: user.name,
        firstName,
        surname: surname.join(" "),
      };
    },
  });
}
```

### Construindo um PerformaticPaginationModel a partir de um array de objetos com uma factory assincrona

O caso mais interessante do uso desta biblioteca pode ser este, o cenario é similar aos antiores você tem um array de objetos do tipo X sendo retornado pela sua fonte de dados, mas deseja retornar um objeto `PerformaticPaginationModel` do tipo Y, porém a construção do objeto Y é assincrona, por exemplo os dados da entidade `User` (visto no exemplo A e B) são retornados de uma fonte de dados, e gostariamos que o objeto `PerformaticPaginationModel` fosse construido incluindo os atributos externalUserName e externalUserGroup que são retornados de maneira asincrona por exemplo de uma API externa e obtidos a partir do externalUserId, para isso podemos usar a função `fromAsyncFactory` que recebe um objeto com os atributos `total`, `take`, `skip`, `data` e uma função que mapeia e constroi um objeto do tipo Y chamada `asyncFactory`. Vamos ver o exemplo:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";
import { databaseConnection } from "./database-connection";

async function getUsers(take: number, skip: number) {
  const total = await databaseConnection.users.count(); // total is a number
  const users = await databaseConnection.users.find({ take: take, skip: skip }); // users is an array of objects with the same structure of example A

  return PerformaticPaginationModel.fromAsyncFactory({
    total,
    take,
    skip,
    data: users,
    asyncFactory: async (user) => {
      const { externalUserName, externalUserGroup } = await getExternalUserName(
        user.externalId
      );

      return {
        id: user.id,
        externalId: user.externalId,
        name: user.name,
        externalUserName,
        externalUserGroup,
      };
    },
  });
}
```

Como mencionado anteriormente, podemos explicitamente informar quais atributos queremos retornar, informando adicionalemente a opção `keys`:

```typescript
// ... code here
return PerformaticPaginationModel.fromSyncFactory({
  total,
  take,
  skip,
  data: users,
  options: {
    keys: ["id", "externalId", "externalUserName", "externalUserGroup"],
  },
  factory: (user) => {
    const [firstName, ...surname] = user.name.split(" ");

    return {
      id: user.id,
      externalId: user.externalId,
      name: user.name,
      firstName,
      surname: surname.join(" "),
    };
  },
});
// ... code here
```

O mais legal sobre essa função é que ela 'Performa' as promises de forma paralela, ou seja, ela não espera a promise de um objeto ser resolvida para começar a resolver a promise do próximo objeto, isso faz com que a função seja muito mais performatica que se fossemos fazer isso de forma sequencial.

## Avisos e Considerações

Como tudo na TI não existe uma solução perfeita, e esta biblioteca não é diferente, ela tem alguns pontos que devem ser considerados:

Essa biblioteca foi criada para resolver o problema especifico de enviar dados planificados para o frontend é os principais ganhos de performance ocorrem quando a estrutura é plana, isso quer dizer que nenhuma função executa recursivamente para construir um objeto com estrutura aninhada, por exemplo, se você tiver um objeto do tipo:

```typescript
const user = {
  ids: {
    internalId: 1,
    externalId: '4a3be3c8-4114-4cbc-8da7-5b5f1c8792ae',
  },
  names: {
    firstName: 'John',
    surname: 'Doe',
  },
  contact: {
    email: 'any@email.com'
    phone: '123456789'
  }
}

const users = [
  user
]

```

A estrutura `PerformaticPaginationModel` retornada por esta biblioteca será:

```typescript
{
  total: 1,
  take: 1,
  skip: 0,
  page: {
    data: {
      keys: ["ids", "names", "contact"],
      values: [
        [
          { internalId: 1, externalId: "4a3be3c8-4114-4cbc-8da7-5b5f1c8792ae" },
          { firstName: "John", surname: "Doe" },
          { email: "any@email.com", phone: "123456789" },
        ],
      ],
    },
    length: 1,
  },
};
```

Ou seja o problema de manter de repetição de nomes é replicado, uma vez que as estruturas aninhadas não são planificadas, e sim mantidas como objetos, isso pode ser um problema se você tiver muitos atributos aninhados, e o ganho de performance não será tão significativo.

> Futuramente eu planejo implementar opção autoFlat para solucionar este problema.

---

Outra coisa sobre a biblioteca é que os dados não são tão facilmente lidos, pois os atributos são retornados em um array de arrays, e não em um array de objetos, o que pode dificultar o debug, por isso o objeto PerformaticPaginationModel possui um método asList que retorna um array de objetos.

## TODO:

- [ ] Implementar opção autoFlat para planificar estruturas aninhadas
- [ ] Adicionar documentação online de todos os métodos e classes.
- [ ] Adicionar documentação em inglês.
