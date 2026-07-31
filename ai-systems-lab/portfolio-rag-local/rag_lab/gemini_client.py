from __future__ import annotations

import os

from rag_lab.config import gemini_model_name, load_local_env


SYSTEM_INSTRUCTION = (
    "You are Dinupa Devinda's portfolio RAG assistant. "
    "Answer only from the retrieved portfolio context. "
    "Be concise, honest, and useful for technical recruiters. "
    "If the retrieved context does not contain the answer, say the portfolio does not include that information. "
    "Do not invent employment, awards, production claims, certifications, or metrics."
)


def build_grounded_prompt(question: str, retrieved_chunks: list[dict]) -> str:
    context_blocks = []
    for index, chunk in enumerate(retrieved_chunks, start=1):
        context_blocks.append(
            "\n".join(
                [
                    f"[Source {index}] {chunk['title']}",
                    f"Source id: {chunk['source']}",
                    chunk["text"]
                ]
            )
        )

    return "\n\n".join(
        [
            "Retrieved portfolio context:",
            "\n\n---\n\n".join(context_blocks),
            "",
            f"Visitor question: {question}",
            "",
            "Answer with 1-3 short paragraphs or a short bullet list. Include source names when useful."
        ]
    )


def generate_answer(prompt: str) -> str | None:
    load_local_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    from google import genai

    try:
        client = genai.Client(api_key=api_key)
    except TypeError:
        client = genai.Client()

    interaction = client.interactions.create(
        model=gemini_model_name(),
        system_instruction=SYSTEM_INSTRUCTION,
        input=prompt,
        generation_config={
            "temperature": 0.2,
            "thinking_level": "low"
        }
    )

    return interaction.output_text.strip()
