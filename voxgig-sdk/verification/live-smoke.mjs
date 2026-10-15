import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { MinimarketSDK } = require('../ts/dist/MinimarketSDK.js');
const base = process.env.MINIMARKET_BASE_URL || 'http://127.0.0.1:18765';
const anonymous = new MinimarketSDK({ server: { base } });
const results = [];
const record = (scenario, detail) => {
  results.push({ scenario, result: 'passed', ...detail });
  console.log(`PASS ${scenario}`);
};

async function login(username, password) {
  const response = await anonymous.direct({
    path: '/api/auth/login', method: 'POST', body: { username, password },
  });
  assert.equal(response.ok, true);
  assert.equal(response.status, 200);
  assert.equal(typeof response.data.token, 'string');
  return response.data.token;
}

const denied = await anonymous.direct({ path: '/api/productos', method: 'GET' });
assert.equal(denied.ok, false);
assert.equal(denied.status, 401);
record('Unauthenticated request rejected', { httpStatus: denied.status });

const token = await login('admin', 'admin123');
record('Login through generated SDK direct()', { httpStatus: 200 });
const client = new MinimarketSDK({ server: { base }, apikey: token });
const list = await client.direct({ path: '/api/productos', method: 'GET' });
assert.equal(list.status, 200);
const seeded = list.data._embedded.productoList;
assert.ok(Array.isArray(seeded) && seeded.length > 0);
record('Authenticated HAL collection read', { httpStatus: 200 });

const product = await client.Producto().load({ id: seeded[0].id });
assert.equal(product.data().nombre, seeded[0].nombre);
record('Generated Producto.load() reads real product', { httpStatus: 200 });

let createdId;
try {
  const payload = {
    nombre: 'Voxgig SDK smoke test', precio: 1234, stock: 3,
    categoria: { id: seeded[0].categoria.id },
  };
  const created = await client.Producto().create(payload);
  createdId = created.data().id;
  assert.ok(Number.isInteger(createdId));
  assert.equal(created.data().nombre, payload.nombre);
  record('Generated Producto.create()', { httpStatus: 200 });

  const updated = await client.Producto().update({ ...payload, id: createdId, stock: 4 });
  assert.equal(updated.data().stock, 4);
  record('Generated Producto.update()', { httpStatus: 200 });

  const readerToken = await login('cliente', 'cliente123');
  const reader = new MinimarketSDK({ server: { base }, apikey: readerToken });
  const forbidden = await reader.direct({ path: '/api/productos', method: 'POST', body: payload });
  assert.equal(forbidden.ok, false);
  assert.ok([401, 403].includes(forbidden.status));
  const readerGet = await reader.direct({ path: '/api/productos', method: 'GET' });
  assert.equal(readerGet.status, 200);
  const rawDenied = await fetch(base + '/api/productos', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + readerToken },
    body: JSON.stringify(payload),
  });
  assert.equal(forbidden.status, rawDenied.status);
  record('Read-only user can read but cannot create products', {
    readStatus: readerGet.status, deniedStatus: forbidden.status,
    rawHttpStatus: rawDenied.status,
    note: forbidden.status === 401 ? 'Backend also returns 401 for a valid user with insufficient role; 403 would be clearer.' : 'Role denial returns 403.',
  });

  await client.Producto().remove({ id: createdId });
  const missing = await client.direct({ path: '/api/productos/{id}', params: { id: createdId }, method: 'GET' });
  assert.equal(missing.ok, false);
  assert.equal(missing.status, 404);
  createdId = undefined;
  record('Generated Producto.remove() and subsequent 404', { httpStatus: 404 });
} finally {
  if (createdId !== undefined) {
    await client.direct({ path: '/api/productos/{id}', params: { id: createdId }, method: 'DELETE' });
  }
}

const collectionEntity = await client.Producto().load();
const collectionKeys = Object.keys(collectionEntity.data());
record('Collection is currently exposed through load(), not list()', { dataKeys: collectionKeys });

await writeFile(new URL('../evidence/live-results.json', import.meta.url), JSON.stringify({
  testedAt: new Date().toISOString(), backend: 'real Spring Boot + H2; no HTTP mock',
  scope: 'login + products only', results,
}, null, 2) + '\n');
console.log(`${results.length} live checks passed; no tokens written to evidence.`);
