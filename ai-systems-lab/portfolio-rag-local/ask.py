from __future__ import annotations

import argparse
import textwrap

from rag_lab.embedding import embed_texts, load_embedding_model
from rag_lab.gemini_client import build_grounded_prompt, generate_answer
from rag_lab.vector_store import query_records


def answer_question(question: str, top_k: int = 4, with_llm: bool = True) -> dict:
    model = load_embedding_model()
    question_embedding = embed_texts([question], model=model)[0]
    sources = query_records(question_embedding, top_k=top_k)
    prompt = build_grounded_prompt(question, sources)
    answer = generate_answer(prompt) if with_llm else None

    return {
        "question": question,
        "answer": answer,
        "sources": sources
    }


def print_result(result: dict) -> None:
    print("\nQUESTION")
    print(result["question"])

    print("\nANSWER")
    if result["answer"]:
        print(result["answer"])
    else:
        print(
            "No GEMINI_API_KEY was found, so this is retrieval-only mode. "
            "The sources below show what would be sent to the LLM."
        )

    print("\nSOURCES")
    for index, source in enumerate(result["sources"], start=1):
        preview = " ".join(source["text"].split())
        preview = textwrap.shorten(preview, width=280, placeholder="...")
        similarity = 1 - float(source["distance"])
        print(f"{index}. {source['title']} ({source['source']})")
        print(f"   similarity score: {similarity:.3f}")
        print(f"   preview: {preview}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Ask the local portfolio RAG index a question.")
    parser.add_argument("question", help="Question to ask")
    parser.add_argument("--top-k", type=int, default=4, help="Number of chunks to retrieve")
    parser.add_argument(
        "--retrieval-only",
        action="store_true",
        help="Only show retrieved chunks without calling Gemini"
    )
    args = parser.parse_args()

    result = answer_question(args.question, top_k=args.top_k, with_llm=not args.retrieval_only)
    print_result(result)


if __name__ == "__main__":
    main()
