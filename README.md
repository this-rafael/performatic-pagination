# Performatic Pagination

> Portuguese Read?
> [See here](./docs/README.pt.md)

## Você sabia?

Performatic Pagination

## Did you know?

Did you know that your requests may be wasting up to 50% of your payload size? That's right, your payload size can be reduced by up to 50% with the
implementation of performatic pagination.
Imagine a scenario where you respond to the client a list of clients of type client (id, name, birthDate, email, externalId, createdAt, updatedAt, deletedAt) with a single value, example:

> SIMPLE A:

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

We can do a simple count and observe that the count of attribute names is 8 and the number of values is 8, so we have that for one element we have in our answer 8 attributes and 8 values, let's see what happens when we have an array with 2 elements:

> SIMPLE B:

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
    "name": "Jane Doe",
    "birthDate": "1990-01-01",
    "email": "jane.doe.@email.com",
    "externalId": "73f7ea98-f249-4b76-b85e-d08d86cc9783",
    "createdAt": "2019-01-01T00:00:00.000Z",
    "updatedAt": "2019-01-01T00:00:00.000Z",
    "deletedAt": "2019-01-01T00:00:00.000Z"
  }
]
```

Well, for this case we have 2 elements, each one with 8 attribute names and 8 values, this illustrates the problem: when we serialize an object in json
it obviously keeps its key-value structure, however when we have an array of objects, the json serializes each object as an independent object, which makes us have redundancy in the attribute names. If the array has 1000 elements, we will have 1000 times the attribute names. This makes the payload size increase considerably. And this can be solved with the implementation of performatic pagination.

## What does this library do?

Briefly, this library serves to transform an array of objects into a `PerformaticPaginationModel` object that contains the attributes `total` indicating the total number of elements, `take` indicating the number of elements that were returned, `skip` indicating the number of elements that were skipped and finally `page` that represents the current page. Being `page` the object that contains the elements. Being it a `PageModel` object it has attributes: `keys` that represent keys that each object has and `values` are values for each element of an array. Thus, previous array would become something like:

We can do a simple count and observe that count of attribute names is 8 and count of values is 8. So we have for one element we have in our response 8 attributes and 8 values. Let's see what happens when we have an array with 2 elements:

> SIMPLE C:

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

In other words, unlike serializing an array of objects, when serializing the `PageModel` we don't have redundancy of attribute names, this makes the payload size reduced by up to 50%, and that's very good, because the payload size is one of the factors that most influences the response time of a request.

## How to use?

> This library can be used in 4 ways basically, either to type a json object that you receive for example in a request (fromData), or to transform an array of objects into a `PerformaticPaginationModel` object (fromEntities), or apply a factory mapping an array of objects into another and then building a `PerformaticPaginationModel` object synchronously (fromSyncFactory) or asynchronously (fromAsyncFactory).

### Building a PerformaticPaginationModel from an object

Imagine the scenario where you consume an API that returns a PerformaticPaginationModel for example the data that will be returned are the same as example C, we would have something like:

```typescript
const response = await fetch("https://your-api.com/your-endpoint"); // return ok with status 200 and json is the same of example C
const object = await request.json(); // object is the same of example C but with type any
```

The problem is that the object `object` is not typed, and therefore we cannot access the methods available in the class `PerformaticPaginationModel`. We can easily solve this with the function `fromData` that receives any object and returns a typed object `PerformaticPaginationModel`. See the example:

```typescript
import { PerformaticPaginationModel } from "performatic-pagination-model";

const response = await fetch("https://your-api.com/your-endpoint"); // return ok with status 200 and json is the same of example C
const object = await request.json(); // object is the same of example C but with type any
const performaticPaginationModel = PerformaticPaginationModel.fromData(object); // performaticPaginationModel is a PerformaticPaginationModel
```

With the syntax above we can use all the methods available in the `PerformaticPaginationModel` class without problems. For example, if we want to map each
record creating a new `PerformaticPaginationModel` with the attributes `id` and `name` we would have something like:

```typescript
const mappedPerformaticPagination = performaticPaginationModel.map((item) => ({
  id: item.id,
  name: item.name,
})); // have same itens of performaticPaginationModel but with only id and name
```

Of course this is just an example of what can be done, all the methods available in the `PerformaticPaginationModel` class can be used.

### Building a PerformaticPaginationModel from an array of objects

The most common use case for this library is when we want to get rid of the redundancy of attribute names, and at the same time we want to return a paginated query between values of `skip` and `take`, for that we can use the function `fromEntities` that receives an object with the attributes `total`, `take`, `skip` and `entries` and returns a typed object `PerformaticPaginationModel`, see the example:

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

In the example, we pass an array of objects to the `fromEntities` function and it returns a typed `PerformaticPaginationModel` object. This happens because the Page `PageModel` is built from the array.

A variation of the code above is passing an optional properties object keys that is an array of strings. With it, we define which attributes we want to be returned. See the example:

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

### Building a PerformaticPaginationModel from an array of objects with a synchronous factory

This scenario reflects the following situation: given that you have an array of type X returned by your data source, but you want to return an object `PerformaticPaginationModel` of type Y, for that we can use the function `fromSyncFactory` that receives an object with the attributes `total`, `take`, `skip`, `data` and a function that maps and builds an object of type Y called `factory`.

For the following example we will consider the data model from example A `User` and that we want to map it to the type `SimpleUser` which is an object with the attributes `id`, `externalId` and `name`, we can do this as follows:

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

As mentioned before, we can explicitly specify which attributes we want to return, by additionally informing the option `keys`:

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

The coolest thing about this function is that it 'Performs' the promises in parallel, that is, it does not wait for the promise of one object to be resolved before starting to resolve the promise of the next object, this makes the function much more performant than if we were to do this sequentially.

## Performance Comparison

The table below presents the performance comparison between using the performatic-pagination function and the simple list for different routes and quantities of elements. The performatic-pagination function consists of dividing the data into smaller and faster pages to load, while the simple list shows all the data at once. The table shows the average time in milliseconds (ms) for each route, using or not using the performatic-pagination function, and the method used to generate the data.

| ROTA            | QUANTIDADE DE ELEMENTOS | TAMANHO | TEMPO 1 | TEMPO 2 | TEMPO 3 | TEMPO 4 | TEMPO 5 | MEDIA | UNIDADE DE MEDIDA | TEMPO EM MS | USE PAGE | METODO USADO       |
| --------------- | ----------------------- | ------- | ------- | ------- | ------- | ------- | ------- | ----- | ----------------- | ----------- | -------- | ------------------ |
| LIST-OF-A       | 10000                   | 3.8mb   | 78,1    | 60,9    | 58,8    | 47,3    | 56,6    | 60,34 | ms                | 60,34       | FALSE    | -                  |
| PAGE-OF-A       | 10000                   | 2.4mb   | 39,9    | 50,9    | 42,5    | 39,9    | 41,8    | 43    | ms                | 43          | TRUE     | FROM ENTRIES       |
| LIST-OF-B-SYNC  | 6000                    | 2.5mb   | 44,5    | 48      | 70,9    | 49,8    | 48,9    | 52,42 | ms                | 52,42       | FALSE    | -                  |
| PAGE-OF-B-SYNC  | 6000                    | 1,7mb   | 45,2    | 43,7    | 46,2    | 36,7    | 47,7    | 43,9  | ms                | 43,9        | TRUE     | FROM FACTORY SYNC  |
| LIST-OF-B-ASYNC | 100000                  | 41.4mb  | 2,03    | 2,09    | 1,94    | 1,94    | 2,02    | 2,004 | s                 | 2004        | FALSE    | -                  |
| PAGE-OF-B-ASYNC | 100000                  | 26.6mb  | 1,75    | 1,74    | 1,87    | 1,9     | 1,87    | 1,826 | s                 | 1826        | TRUE     | FROM FACTORY ASYNC |

From the table it is possible to observe that the performatic-pagination function presents an improvement in performance compared to the simple list in all cases analyzed, and also in a smaller payload size.

The tests for this table were performed from a local server. The code for this test can be found in the [repository](https://github.com/this-rafael/performatic_pagination_nestjs).
The routes were tested using Insomnia, and you can download the file with the collection of tests

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Try%20It&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fthis-rafael%2Fperformatic_pagination_nestjs%2Fmaster%2Ftest%2Fused-requests)

## Warnings and Considerations

As with everything in IT there is no perfect solution, and this library is no different, it has some points that should be considered:

This library was created to solve the specific problem of sending flattened data to the frontend and the main performance gains occur when the structure is flat, this means that no function executes recursively to build an object with nested structure, for example, if you have an object of type:

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

const users = [ // array of user with one element
  user
]

```

The `PerformaticPaginationModel` structure returned by this library will be:

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

That is, the problem of maintaining repetition of names is replicated, since nested structures are not flattened, but kept as objects. This can be a problem if you have many nested attributes, and the performance gain will not be so significant.

> In the future I plan to implement an autoFlat option to solve this problem.

---

Another thing about the library is that data is not so easily read, because attributes are returned in an array of arrays, and not in an array of objects, which can make debugging difficult. That's why PerformaticPaginationModel object has a method asList that returns an array of objects.

> Thats page can be this task easier [page](https://this-rafael.github.io/performatic-pagination-model/)

## TODO:

- [ ] Implement autoFlat option to flatten nested structures
- [ ] Add online documentation for all methods and classes.
- [x] Add documentation in English.
