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
  assert.match(html, /Distinguish long and short vowels when reading one-syllable words/);
  assert.match(html, /Apply properties of operations/);
});

test("renders the MDX-backed phonics lesson", async () => {
  const response = await render("/topics/distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Distinguish long from short vowel sounds in spoken single-syllable words/);
  assert.match(html, /class="sl-grade-select"><span>Grade 1/);
  assert.match(html, /Watch/);
  assert.match(html, /Try/);
  assert.match(html, /Practice/);
  assert.match(html, /Check/);
  assert.match(html, /Extend/);
  assert.match(html, /RF\.1\.2\.a/);
  assert.match(html, /UFLI Foundations/);
  assert.match(html, /distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral/);
  assert.match(html, /Next lesson/);
});

test("renders the separate Grade 2 phonics lesson", async () => {
  const response = await render("/topics/distinguish-long-and-short-vowels-when-reading-one-syllable-words-review-apply-a-u");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="sl-grade-select"><span>Grade 2/);
  assert.match(html, /Distinguish long and short vowels when reading one-syllable words/);
  assert.match(html, /RF\.2\.3\.a/);
  assert.match(html, /Open Home Practice/);
  assert.match(html, /Previous lesson/);
});

test("renders the single-course properties lesson", async () => {
  const response = await render("/topics/properties-of-operations");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="sl-grade-select"><span>Grade 1/);
  assert.match(html, /Watch/);
  assert.match(html, /Practice/);
  assert.match(html, /Extend/);
  assert.match(html, /1\.OA\.B\.3/);
  assert.match(html, /The Math Learning Center/);
});

test("lists exact Grade 1+ titles and routes", async () => {
  const topics = await (await render("/topics")).text();
  assert.match(topics, /href="\/topics\/distinguish-long-from-short-vowel-sounds-in-spoken-single-syllable-words-oral"/);
  assert.match(topics, /href="\/topics\/distinguish-long-and-short-vowels-when-reading-one-syllable-words-review-apply-a-u"/);
  assert.match(topics, /Distinguish long and short vowels when reading one-syllable words/);
  assert.doesNotMatch(topics, /long-short-vowels-grade-2/);
});

test("does not expose the invented Grade 2 phonics route", async () => {
  const response = await render("/topics/long-short-vowels-grade-2");
  assert.equal(response.status, 404);
});

test("renders the workbook-derived mathematics lesson and about page", async () => {
  const math = await (await render("/topics/addition-subtraction-word-problems")).text();
  assert.match(math, /Ontario core within 50/);
  assert.match(math, /The Math Learning Center/);
  const about = await (await render("/about")).text();
  assert.match(about, /I help turn complex educational material into usable experiences/);
});
