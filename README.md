# Todo GraphQL

API **GraphQL** de tareas construida con **NestJS** y **Apollo Server** en modo _code-first_. Es un proyecto de aprendizaje de los fundamentos de GraphQL: **queries con y sin argumentos**, **mutations con inputs validados**, **args opcionales**, **tipos de agregación** y **campos deprecados**. Los datos viven **en memoria**, así que no necesita base de datos ni variables de entorno: instalar, arrancar y explorar con Apollo Sandbox.

![Tech](https://img.shields.io/badge/NestJS-10-E0234E)
![Tech](https://img.shields.io/badge/GraphQL-Apollo-311C87)
![Tech](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tech](https://img.shields.io/badge/class--validator-0.14-blue)

---

## Tabla de contenidos

- [Todo GraphQL](#todo-graphql)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación y arranque](#instalación-y-arranque)
    - [Scripts disponibles](#scripts-disponibles)
  - [Queries y mutations](#queries-y-mutations)
    - [Todos](#todos)
    - [Hello World](#hello-world)
    - [Ejemplos](#ejemplos)
  - [Cómo funciona](#cómo-funciona)
    - [1. `main.ts` y `app.module.ts`](#1-maints-y-appmodulets)
    - [2. Módulo `todo`](#2-módulo-todo)
    - [3. Módulo `hello-world`](#3-módulo-hello-world)
    - [Flujo de una petición](#flujo-de-una-petición)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **CRUD de tareas** (`Todo`: `id`, `description`, `done`) sobre un array en memoria con 5 tareas iniciales.
- **Filtro opcional** por estado (`status: Boolean`) al listar tareas.
- **Contadores**: total, completadas y pendientes, por separado o agrupados en el tipo `AggregationsType`.
- **Validación de inputs** con `class-validator` (descripción entre 3 y 20 caracteres, `id` entero ≥ 1).
- **Errores tipados**: `NotFoundException` cuando el `id` no existe.
- **Queries de ejemplo** (`hello-world`) que devuelven strings, `Float` e `Int`, con argumentos opcionales y valor por defecto.
- **Esquema autogenerado y autodocumentado** en `src/schema.gql`: tipos, campos, argumentos y operaciones llevan su `description`, visible en **Apollo Sandbox** (servido solo fuera de producción).

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js** y **npm**

### Instalación y arranque

```bash
npm install
npm run start:dev
```

La API escucha en el puerto **4000**. Abre `http://localhost:4000/graphql` para usar Apollo Sandbox, que solo se sirve cuando `NODE_ENV` es distinto de `production`.

> Al estar en memoria, los cambios se pierden al reiniciar el servidor.

### Scripts disponibles

| Script                | Descripción                         |
| --------------------- | ----------------------------------- |
| `npm run start`       | Arranca la aplicación               |
| `npm run start:dev`   | Modo desarrollo con _watch_         |
| `npm run start:debug` | Modo depuración con _watch_         |
| `npm run build`       | Compila a `dist/`                   |
| `npm run start:prod`  | Ejecuta la build (`node dist/main`) |
| `npm run lint`        | ESLint con autocorrección           |
| `npm run format`      | Prettier sobre `src/` y `test/`     |
| `npm run test`        | Tests unitarios (Jest)              |
| `npm run test:e2e`    | Tests end-to-end                    |
| `npm run test:cov`    | Cobertura de tests                  |

---

## Queries y mutations

### Todos

| Operación        | Tipo     | Argumentos                                   | Devuelve           |
| ---------------- | -------- | -------------------------------------------- | ------------------ |
| `todos`          | Query    | `status: Boolean` (opcional)                 | `[Todo!]!`         |
| `todo`           | Query    | `id: Int!`                                   | `Todo!`            |
| `totalTodos`     | Query    | —                                            | `Int!`             |
| `completedTodos` | Query    | —                                            | `Int!`             |
| `pendingTodos`   | Query    | —                                            | `Int!`             |
| `aggregations`   | Query    | —                                            | `AggregationsType!` (`total`, `pendding`, `completed`, `totalTodosCompleted` deprecado) |
| `createTodo`     | Mutation | `CreateTodoInput: { description }`           | `Todo!`            |
| `updateTodo`     | Mutation | `updateTodoInput: { id, description?, done? }` | `Todo!`          |
| `removeTodo`     | Mutation | `id: Int!`                                   | `Boolean!`         |

### Hello World

| Operación                | Argumentos               | Devuelve                              |
| ------------------------ | ------------------------ | ------------------------------------- |
| `getHello`               | —                        | `"Hello World!"`                      |
| `RandomNumber`           | —                        | `Float` aleatorio entre 0 y 100       |
| `getNumberFromZeroTo`    | —                        | `Int` aleatorio entre 0 y 9           |
| `getNumberFromZeroToAny` | `to: Int` (por defecto 6) | `Int` aleatorio entre 0 y `to - 1`   |

### Ejemplos

```graphql
query {
  todos(status: false) {
    id
    description
    done
  }
  aggregations {
    total
    completed
    pendding
  }
}
```

```graphql
mutation {
  createTodo(CreateTodoInput: { description: "Learn Apollo" }) {
    id
    description
    done
  }
}
```

---

## Cómo funciona

### 1. `main.ts` y `app.module.ts`

- `main.ts` habilita CORS, registra un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`) y escucha en el puerto `4000`.
- `AppModule` configura `GraphQLModule.forRoot` con `ApolloDriver`, `autoSchemaFile: src/schema.gql`, el _playground_ clásico desactivado y el plugin `ApolloServerPluginLandingPageLocalDefault` (Apollo Sandbox) cuando `NODE_ENV` no es `production`.

### 2. Módulo `todo`

- `Todo` (`entity/todo.entity.ts`) es un `@ObjectType` con `done` a `false` por defecto.
- `TodoResolver` expone las queries y mutations y delega en `TodoService`; `aggregations` compone el `AggregationsType` a partir de los contadores del servicio.
- `TodoService` guarda las tareas en un array privado:
  - `findAll` filtra por `done === status` cuando se pasa `status`.
  - `findOne` lanza `NotFoundException` si no encuentra el `id`.
  - `createTodo` asigna `id = max(ids) + 1`.
  - `updateTodo` solo modifica los campos enviados; `delete` comprueba que exista y lo elimina.
- DTOs: `StatusArgs` (`@ArgsType`), `CreateTodoInput` y `UpdateTodoInput` (`@InputType`) con decoradores de `class-validator`.

### 3. Módulo `hello-world`

`HelloWorldResolver` agrupa queries sin estado que muestran cómo declarar nombres, descripciones, tipos escalares (`String`, `Float`, `Int`) y argumentos opcionales con valor por defecto.

### Flujo de una petición

```
Cliente (Apollo Sandbox)
   │  POST /graphql
   ▼
ValidationPipe (class-validator sobre args e inputs)
   ▼
TodoResolver / HelloWorldResolver
   ▼
TodoService  ──►  array en memoria (todos[])
   ▼
Respuesta tipada según src/schema.gql
```

---

## Tecnologías

- **NestJS 10** — módulos, resolvers y pipes.
- **GraphQL 16** con **@nestjs/graphql** y **@nestjs/apollo** (Apollo Server) en modo _code-first_.
- **class-validator** / **class-transformer** para validar args e inputs.
- **TypeScript 5**, **Jest**, **ESLint** y **Prettier**.

---

## Estructura del proyecto

```
todo-graphql/
├── src/
│   ├── main.ts                       # Bootstrap: CORS, ValidationPipe, puerto 4000
│   ├── app.module.ts                 # GraphQLModule (Apollo) + módulos
│   ├── schema.gql                    # Esquema generado automáticamente
│   ├── hello-world/
│   │   ├── hello-world.module.ts
│   │   └── hello-world.resolver.ts   # Queries de ejemplo
│   └── todo/
│       ├── todo.module.ts
│       ├── todo.resolver.ts
│       ├── todo.service.ts           # Datos en memoria
│       ├── entity/todo.entity.ts
│       ├── dto/
│       │   ├── args/status.args.ts
│       │   └── inputs/               # create-todo.input.ts, update-todo.input.ts
│       └── types/aggregations.type.ts
├── test/                             # app.e2e-spec.ts, jest-e2e.json
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## Personalización

El proyecto no usa variables de entorno propias (solo `NODE_ENV`: con `production` no se sirve Apollo Sandbox). Puntos fáciles de ajustar:

| Dónde                     | Qué                                      | Por defecto            |
| ------------------------- | ---------------------------------------- | ---------------------- |
| `src/main.ts`             | Puerto del servidor                      | `4000`                 |
| `src/todo/todo.service.ts`| Tareas iniciales (array `todos`)         | 5 tareas               |
| `src/todo/dto/inputs/*`   | Longitud permitida de `description`      | 3 – 20 caracteres      |
| `src/app.module.ts`       | Ruta del esquema generado                | `src/schema.gql`       |

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
