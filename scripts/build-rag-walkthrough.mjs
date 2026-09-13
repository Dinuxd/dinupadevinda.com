import { readFile, writeFile } from 'node:fs/promises';
import { buildRagChunks } from '../portfolio-chat-worker/src/knowledge.ts';
import { lexicalSearch } from '../portfolio-chat-worker/src/retrieval.ts';

const knowledge = await readFile(new URL('../public/portfolio-chat.json', import.meta.url), 'utf8');
const chunks = buildRagChunks(knowledge);
const questions = ['What computer vision projects has Dinupa built?', 'What audio machine learning projects has Dinupa built?', 'What backend projects has Dinupa built?'];
const samples = questions.map(question => ({
  question,
  sources: lexicalSearch(question, chunks, 3).map(({ chunk, score }) => ({
    title: chunk.title, text: chunk.text, url: chunk.url, score
  }))
}));
await writeFile(new URL('../content/rag-walkthrough.json', import.meta.url), JSON.stringify({ mode: 'Saved keyword retrieval', samples }, null, 2) + '\n');
