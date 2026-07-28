import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the teacher lesson workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Long &amp; Short Vowels \| Old MacDonald Had a School<\/title>/i);
  assert.match(html, /Grade 1 and Grade 2 lesson workspaces/);
  assert.match(html, /Long vs\. Short Sound Sort/);
  assert.match(html, /Short Vowel Review, Lesson 41/);
  assert.match(html, /Need a different resource\?/);
  assert.match(html, /Copy prompt/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Energy level|Favorites/i);
});
