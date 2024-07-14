import { expect, test, beforeAll, afterAll } from "bun:test";
const { spawn } = require('node:child_process');

let cp;

beforeAll(() => {
  cp = spawn('bun', ['src/index.ts']);

  cp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cp.on('close', (code) => {
    console.log(`test process exited with code ${code}`);
  });
});

const waitFor = (ms = 3000) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const tryFetch = async (url, retry = 0, maxRetries = 5) => {
  try {
    return await fetch(url);
  } catch (e) {
    retry++;
    if (retry > maxRetries) throw e;
    await waitFor(200);
    return tryFetch(url, retry);
  }
};

function killCp() {
  if (cp) {
    console.log(`attempting to kill test process ${cp.pid}`);
    const killed = cp.kill('SIGKILL');
    if (!killed) console.error(`test process ${cp.pid} did not exit cleanly, please kill it manually`);
  }
}

process.on('uncaughtException', () => {
  console.log('bun test uncaughtException');
  killCp();
});

process.on('beforeExit', () => {
  console.log('bun test beforeExit');
  killCp();
});

afterAll(() => {
  killCp();
});

test('calling /v1/hello/:name', async () => {
  const response = await tryFetch('http://127.0.0.1:1993/v1/hello/tester');
  const respText = await response.text();
  expect(respText).toBe('hello, tester');
});
