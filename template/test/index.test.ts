/**
 * Forewords:
 * This file is just an example of how we may implement test logic for
 * this project. You can throw this whole file away and write your own
 * tests using whichever test framework you prefer.
 */

import { expect, test, beforeAll, afterAll } from "bun:test";
import { spawn, type ChildProcess } from "node:child_process";

let cp: ChildProcess;
let cpExited: boolean;

beforeAll(() => {
  cp = spawn("bun", ["src/index.ts"]);
  cp.stderr?.on("data", (data) => console.error(`test process stderr: ${data}`));
  cp.on("error", (err) => console.error(err.stack));
  cp.on("close", (code) => { cpExited = true; });
});

const waitFor = (ms = 3000) => new Promise((resolve) => setTimeout(resolve, ms));

const tryFetch = async (url: string, retry = 0, maxRetries = 5): Promise<Response> => {
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
  if (cp && !cpExited) {
    const killed = cp.kill("SIGKILL");
    if (!killed) console.warn(`test process ${cp.pid} may not have exited cleanly, please ensure it is killed`);
  }
}

process.on("uncaughtException", (e) => {
  console.error("test: uncaughtException", e.stack);
  killCp();
});

afterAll(() => { killCp(); });

test("call /v1/hello/:name", async () => {
  const response = await tryFetch("http://127.0.0.1:1993/v1/hello/tester");
  const respText = await response.text();
  expect(respText).toBe("hello, tester");
});

test("call /oas.json", async () => {
  const response = await tryFetch("http://127.0.0.1:1993/oas.json");
  const respJson = await response.json();
  expect(respJson).toMatchSnapshot("OpenApiSpecJsonDoc");
});
