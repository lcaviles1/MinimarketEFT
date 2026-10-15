# MiniMarket SDK — Voxgig mini task 1

Author: Lucas Avilés Arias · [GitHub](https://github.com/lcaviles1) · [LinkedIn](https://www.linkedin.com/in/lcaviles/)

A TypeScript SDK generated with Voxgig for my existing MiniMarket Plus Spring Boot API. The scope is authentication and product CRUD, rather than every endpoint in the backend. The SDK lives in this directory; the original Java API is its parent directory.

**Start with [REPORT.md](REPORT.md)** for the short developer-experience report and measured results.

## Verified result

- Generated using `@voxgig/create-sdkgen` 0.30.7 and `@voxgig/sdkgen` 4.34.7.
- TypeScript build successful.
- Generated suite: 218 tests, 209 passed, 9 skipped, 0 failed. Skipped tests are not counted as passes.
- Nine additional checks against the actual Spring Boot/H2 backend passed, including authentication, CRUD and access denial.
- `voxgig-sdkgen doctor` passed with no scaffold drift.
- No npm package has been published. The source, compiled SDK, generator and lockfiles are provided here.

## Quickstart from this repository

Use Node.js 24+, npm, Java 17 and the included Maven wrapper. Initial installation needs network access to npm and Maven Central.

From the Java repository root:

```bash
cd voxgig-sdk/.sdk
npm ci
npm run generate
cd ../ts
npm ci
npm test
```

To run the additional integration checks, from `voxgig-sdk`:

```bash
bash verification/run-live.sh
```

The script starts the existing Java backend on `127.0.0.1:18765`, uses a fresh in-memory H2 database, exercises the SDK, deletes the product it creates, and stops the backend. It uses only the demo accounts already published in the parent project's README. Do not point these write checks at a production database.

The runner uses Node to manage the backend process and works on macOS and Linux.

## Use the SDK

With the local backend running:

```js
const { MinimarketSDK } = require('./ts/dist/MinimarketSDK.js');

const server = { base: 'http://127.0.0.1:18765' };
const anonymous = new MinimarketSDK({ server });
const login = await anonymous.direct({
  path: '/api/auth/login',
  method: 'POST',
  body: { username: 'admin', password: 'admin123' }, // Local demo only.
});
if (!login.ok) throw new Error(`Login failed: ${login.status}`);

const client = new MinimarketSDK({ server, apikey: login.data.token });
const product = await client.Producto().load({ id: 1 });
console.log(product.data());
```

Run this snippet inside an async function or a Node REPL with top-level await. Credentials above are seeded local test fixtures, not an external service account. The generated `apikey` option sends this API's JWT as `Authorization: Bearer …`. Tokens are not printed or committed.

The current inferred model exposes the HAL collection via `Producto().load()` with no ID; its data retains `_embedded` and `_links`. `direct({ path: '/api/productos', method: 'GET' })` is another verified option.

## Source of truth and attribution

- `.sdk/def/openapi.json`: focused OpenAPI 3.0.3 description transcribed from the existing controllers and entity classes. The original runtime OpenAPI 3.1 document is included as `evidence/backend-openapi.json` for comparison. This is a scoped, curated input, not an unchanged export of the whole backend.
- `.sdk/model/project.aontu`: project-owned author, publisher, repository and package metadata.
- `.sdk/`: locked toolchain, model, templates and components needed to regenerate.
- `ts/`: generated source, compiled SDK, documentation and generated tests. No generated runtime or templates were hand-patched.
- `verification/`: small authored integration and reproducibility checks.
- `evidence/`: sanitized results. The role-denial finding is recorded separately from SDK results.

The original backend is pinned in the report. The SDK contribution is MIT licensed; upstream Voxgig notices are retained. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
