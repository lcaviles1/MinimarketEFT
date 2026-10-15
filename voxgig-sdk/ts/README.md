# Minimarket TypeScript SDK



The TypeScript SDK for the Minimarket API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Producto()` — each with a small set of operations (`load`, `create`, `update`, `remove`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/lcaviles1/MinimarketEFT/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/lcaviles1/MinimarketEFT
npm install ./MinimarketEFT/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { MinimarketSDK } from '@lcaviles1/minimarket-sdk'

const client = new MinimarketSDK({
  apikey: process.env.MINIMARKET_APIKEY,
  // Required: this API's server URL is templated on these.
  server: {
    base: '<base>',
  },
})
```

### 3. Load a producto

`load()` returns the entity and throws on failure; `.data()` reads its record:

```ts
try {
  const producto = await client.Producto().load({ id: 1 })
  console.log(producto.data())
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Create — returns the created Producto ENTITY (.data() for the record)
const created = await client.Producto().create({
  categoria: {},
  embedded: {},
})

// Update — the id comes off the returned entity's data()
const updated = await client.Producto().update({
  id: created.data().id!,
  categoria: {},
  embedded: {},
})

// Remove
await client.Producto().remove({
  id: created.data().id!,
})
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const producto = await client.Producto().load({ id: 1 })
  console.log(producto.data())
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = MinimarketSDK.test()

const producto = await client.Producto().load({ id: 1 })
// producto is the Producto entity; .data() reads its mock record
console.log(producto.data())
```

You can also use the instance method:

```ts
const client = new MinimarketSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Producto()

// First call runs the operation and stores its result
await entity.load({ id: 1 })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data.id)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new MinimarketSDK({
  apikey: '...',
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
MINIMARKET_TEST_LIVE=TRUE
MINIMARKET_APIKEY=<your-key>
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### MinimarketSDK

#### Constructor

```ts
new MinimarketSDK(options?: {
  apikey?: string
  server?: { base: string }
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `server` | `object` | **Required.** Values for the server-URL variables: `base`. The API base URL is a template over them. |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Producto(data?)` | `ProductoEntity` | Create a Producto entity instance. |
| `tester(testopts?, sdkopts?)` | `MinimarketSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `MinimarketSDK.test(testopts?, sdkopts?)` | `MinimarketSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity, and return it. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity, and return it marked as deleted. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): MinimarketSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load`, `create` and `update` resolve to a single entity object.
- `remove` resolves to the entity, marked as deleted.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Producto

| Field | Description |
| --- | --- |
| `categoria` |  |
| `embedded` |  |
| `id` |  |
| `links` |  |
| `nombre` |  |
| `precio` |  |
| `stock` |  |

Operations: create, load, remove, update.

API path: `/api/productos`



## Entities


### Producto

Create an instance: `const producto = client.Producto()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `categoria` | `Record<string, any>` |  |
| `embedded` | `Record<string, any>` |  |
| `id` | `number` |  |
| `links` | `Record<string, any>` |  |
| `nombre` | `string` |  |
| `precio` | `number` |  |
| `stock` | `number` |  |

#### Example: Load

```ts
const producto = await client.Producto().load({ id: 1 })
```

#### Example: Create

```ts
const producto = await client.Producto().create({
})
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
minimarket/
├── src/
│   ├── MinimarketSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { MinimarketSDK } from '@lcaviles1/minimarket-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const producto = client.Producto()
await producto.load({ id: 1 })

// producto.data() now returns the producto data from the last `load`
// producto.match() returns { id: 1 }
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
