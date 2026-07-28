import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the editable-content home page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /A better place to begin tomorrow/);
  assert.match(html, /Two subjects\. One reusable planning pattern/);
  assert.match(html, /Addition &amp; Subtraction Word Problems/);
});

test("renders the MDX-backed phonics lesson", async () => {
  const response = await render("/topics/long-short-vowels");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Long vs\. Short Sound Sort/);
  assert.match(html, /Teacher:/);
  assert.match(html, /Look for:/);
  assert.match(html, /content\/lessons\//);
  assert.match(html, /long-short-vowels/);
});

test("renders the workbook-derived mathematics lesson and about page", async () => {
  const math = await (await render("/topics/addition-subtraction-word-problems")).text();
  assert.match(math, /Ontario core within 50/);
  assert.match(math, /The Math Learning Center/);
  const about = await (await render("/about")).text();
  assert.match(about, /I help turn complex educational material into usable experiences/);
});
