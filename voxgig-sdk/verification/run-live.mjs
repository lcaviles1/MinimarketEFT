import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { openSync, closeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';

const sdkDir = fileURLToPath(new URL('../', import.meta.url));
const apiDir = resolve(sdkDir, '..');
const base = 'http://127.0.0.1:18765';
if (process.env.MINIMARKET_BASE_URL && process.env.MINIMARKET_BASE_URL !== base) {
  throw new Error('This runner is restricted to a fresh local demo backend on port 18765.');
}
try {
  const response = await fetch(base + '/v3/api-docs', { signal: AbortSignal.timeout(500) });
  if (response.status) throw new Error('Port 18765 is already in use. Stop that service before running write checks.');
} catch (error) {
  if (error.message.startsWith('Port 18765')) throw error;
}
const tempDir = await mkdtemp(join(tmpdir(), 'minimarket-sdk-'));
const logPath = join(tempDir, 'backend.txt');
const logFd = openSync(logPath, 'w');
const settings = process.env.MINIMARKET_MAVEN_SETTINGS;
const args = ['./mvnw', ...(settings ? ['-s', settings] : []), '-q', '-DskipTests', 'spring-boot:run',
  '-Dspring-boot.run.arguments=--server.port=18765 --server.address=127.0.0.1'];
const backend = spawn('bash', args, { cwd: apiDir, detached: true, stdio: ['ignore', logFd, logFd] });
closeSync(logFd);
let spawnFailure;
backend.once('error', error => { spawnFailure = error; });
const stop = () => {
  if (backend.pid) {
    try { process.kill(-backend.pid, 'SIGTERM'); } catch {}
  }
};
process.once('SIGINT', () => { stop(); process.exit(130); });
process.once('SIGTERM', () => { stop(); process.exit(143); });
try {
  let ready = false;
  for (let attempt = 1; attempt <= 90; attempt++) {
    if (spawnFailure) throw spawnFailure;
    if (backend.exitCode !== null) throw new Error('Demo backend stopped before becoming ready.');
    try {
      const response = await fetch(base + '/v3/api-docs', { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        const spec = await response.json();
        await writeFile(join(sdkDir, 'evidence/backend-openapi.json'), JSON.stringify(spec));
        ready = true;
        break;
      }
    } catch {}
    if (attempt % 15 === 0) console.log(`Waiting for demo API (${attempt}/90 seconds)`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (!ready) throw new Error('Demo API was not ready within 90 seconds.');
  process.env.MINIMARKET_BASE_URL = base;
  await import('./live-smoke.mjs');
} catch (error) {
  console.error((await readFile(logPath, 'utf8')).split('\n').slice(-20).join('\n'));
  throw error;
} finally {
  stop();
  await new Promise(resolve => setTimeout(resolve, 250));
  await rm(tempDir, { recursive: true, force: true });
}
