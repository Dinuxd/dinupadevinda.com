from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))

from ask import answer_question  # noqa: E402
from rag_lab.config import EVAL_REPORT  # noqa: E402


QUESTIONS_PATH = Path(__file__).resolve().parent / "questions.json"


def normalize(value: str) -> str:
    return value.lower()


def check_case(case: dict, result: dict, with_llm: bool) -> dict:
    answer = result.get("answer") or ""
    source_text = " ".join(source["source"] for source in result["sources"])
    source_title_text = " ".join(source["title"] for source in result["sources"])
    retrieved_text = normalize(f"{source_text} {source_title_text}")
    answer_text = normalize(answer)

    expected_sources = case.get("expected_sources", [])
    source_hits = [source for source in expected_sources if normalize(source) in retrieved_text]

    must_include = case.get("must_include", [])
    include_hits = [item for item in must_include if normalize(item) in answer_text]

    must_not_include = case.get("must_not_include", [])
    forbidden_hits = [item for item in must_not_include if normalize(item) in answer_text]

    source_pass = len(source_hits) > 0 if expected_sources else True
    answer_pass = True
    if with_llm and must_include:
        answer_pass = len(include_hits) > 0
    if with_llm and forbidden_hits:
        answer_pass = False

    return {
        "id": case["id"],
        "question": case["question"],
        "passed": source_pass and answer_pass,
        "source_hits": source_hits,
        "include_hits": include_hits,
        "forbidden_hits": forbidden_hits,
        "top_sources": [source["source"] for source in result["sources"]],
        "answer": answer
    }


def write_report(results: list[dict], with_llm: bool) -> None:
    passed = sum(1 for result in results if result["passed"])
    mode = "retrieval + LLM" if with_llm else "retrieval only"
    lines = [
        "# Portfolio RAG Evaluation Report",
        "",
        f"Generated: {datetime.now().isoformat(timespec='seconds')}",
        f"Mode: {mode}",
        f"Score: {passed}/{len(results)}",
        "",
        "| ID | Pass | Top sources | Notes |",
        "| --- | --- | --- | --- |"
    ]

    for result in results:
        notes = []
        if result["source_hits"]:
            notes.append(f"sources: {', '.join(result['source_hits'])}")
        if result["include_hits"]:
            notes.append(f"answer terms: {', '.join(result['include_hits'])}")
        if result["forbidden_hits"]:
            notes.append(f"forbidden: {', '.join(result['forbidden_hits'])}")
        lines.append(
            f"| {result['id']} | {'yes' if result['passed'] else 'no'} | "
            f"{', '.join(result['top_sources'])} | {'; '.join(notes) or 'review manually'} |"
        )

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- Retrieval-only mode checks whether the vector database finds relevant chunks.",
            "- LLM mode also checks answer text, but still needs human review.",
            "- A failed test is useful: it shows where chunking, retrieval, prompting, or source coverage should improve."
        ]
    )

    EVAL_REPORT.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run simple evaluation checks for the local RAG lab.")
    parser.add_argument("--with-llm", action="store_true", help="Call Gemini and evaluate answer text")
    parser.add_argument("--top-k", type=int, default=4, help="Number of chunks to retrieve per question")
    args = parser.parse_args()

    cases = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    results = []
    for case in cases:
        result = answer_question(case["question"], top_k=args.top_k, with_llm=args.with_llm)
        results.append(check_case(case, result, with_llm=args.with_llm))

    write_report(results, with_llm=args.with_llm)
    passed = sum(1 for result in results if result["passed"])
    print(f"Wrote {EVAL_REPORT}")
    print(f"Score: {passed}/{len(results)}")


if __name__ == "__main__":
    main()
