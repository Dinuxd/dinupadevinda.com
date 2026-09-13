import assert from 'node:assert/strict';
import test from 'node:test';
import { embedDocuments } from '../src/retrieval.ts';

const env = { GEMINI_API_KEY: 'test-only', RAG_EMBEDDING_DIMENSIONS: '128' };
const chunks = Array.from({ length: 51 }, (_, i) => ({ title: `Chunk ${i}`, text: `Text ${i}` }));

test('batches 51 documents into three requests and preserves order', async t => {
  let count = 0;
  const sizes = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.match(url, /:batchEmbedContents$/);
    const { requests } = JSON.parse(init.body);
    sizes.push(requests.length);
    return Response.json({ embeddings: requests.map(request => {
      assert.equal(request.outputDimensionality, 128);
      assert.match(request.model, /^models\//);
      return { values: Array(128).fill(count++) };
    }) });
  });
  const result = await embedDocuments(chunks, env);
  assert.deepEqual(sizes, [20, 20, 11]);
  assert.equal(result.length, 51);
  assert.equal(result[50][0], 50);
});

test('rejects incomplete responses and invalid dimensions', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ embeddings: [] }));
  await assert.rejects(embedDocuments(chunks.slice(0, 1), env), /unexpected count/);
  globalThis.fetch.mock.mockImplementation(async () => Response.json({ embeddings: [{ values: [1] }] }));
  await assert.rejects(embedDocuments(chunks.slice(0, 1), env), /invalid vector/);
});

test('propagates upstream errors and skips empty input', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 429 }));
  assert.deepEqual(await embedDocuments([], env), []);
  assert.equal(mock.mock.callCount(), 0);
  await assert.rejects(embedDocuments(chunks.slice(0, 1), env), /429/);
});
