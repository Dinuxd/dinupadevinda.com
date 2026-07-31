import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { buildRagChunks } from "../src/knowledge.ts";
import { lexicalSearch } from "../src/retrieval.ts";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workerDirectory = path.resolve(scriptDirectory, "..");
const repositoryDirectory = path.resolve(workerDirectory, "..");
const knowledgePath = path.join(repositoryDirectory, "public", "portfolio-chat.json");
const questionsPath = path.join(
  repositoryDirectory,
  "ai-systems-lab",
  "portfolio-rag-local",
  "eval",
  "questions.json"
);
const reportPath = path.join(workerDirectory, "eval", "retrieval-report.md");

const [knowledge, questionsText] = await Promise.all([
  readFile(knowledgePath, "utf8"),
  readFile(questionsPath, "utf8")
]);
const chunks = buildRagChunks(knowledge);
const questions = JSON.parse(questionsText);
const results = questions.map((testCase) => {
  const retrieved = lexicalSearch(testCase.question, chunks, 6);
  const retrievedIds = retrieved.map(({ chunk }) => chunk.id);
  const expected = testCase.expected_sources || [];
  const hits = expected.filter((source) => retrievedIds.some((id) => sourceMatches(source, id)));

  return {
    id: testCase.id,
    passed: expected.length === 0 || hits.length > 0,
    hits,
    retrievedIds
  };
});
const passed = results.filter((result) => result.passed).length;
const lines = [
  "# Worker Retrieval Evaluation",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Score: ${passed}/${results.length}`,
  "",
  "This offline check evaluates the lexical half of the live hybrid retriever. Vectorize and Gemini are tested after deployment.",
  "",
  "| Test | Pass | Expected hit | Top retrieved chunks |",
  "| --- | --- | --- | --- |",
  ...results.map(
    (result) =>
      `| ${result.id} | ${result.passed ? "yes" : "no"} | ${result.hits.join(", ") || "none"} | ${result.retrievedIds.slice(0, 4).join(", ")} |`
  ),
  "",
  "A failed row indicates that chunk wording, query expansion, or ranking should be reviewed."
];

await writeFile(reportPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${reportPath}`);
console.log(`Score: ${passed}/${results.length}`);

if (passed < Math.ceil(results.length * 0.8)) {
  process.exitCode = 1;
}

function sourceMatches(expected, actual) {
  if (actual.includes(expected) || expected.includes(actual)) {
    return true;
  }

  const generic = new Set(["project", "projects", "certification", "education", "experience"]);
  const expectedTerms = new Set(expected.split("-").filter((term) => term.length > 2 && !generic.has(term)));
  const actualTerms = new Set(actual.split("-").filter((term) => term.length > 2 && !generic.has(term)));
  const overlap = [...expectedTerms].filter((term) => actualTerms.has(term)).length;
  return expectedTerms.size > 0 && overlap / expectedTerms.size >= 0.6;
}
