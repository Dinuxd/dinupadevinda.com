from __future__ import annotations

import json
from pathlib import Path

from sentence_transformers import SentenceTransformer

from rag_lab.chunking import Chunk
from rag_lab.config import embedding_model_name


def load_embedding_model() -> SentenceTransformer:
    return SentenceTransformer(embedding_model_name())


def embed_texts(texts: list[str], model: SentenceTransformer | None = None) -> list[list[float]]:
    encoder = model or load_embedding_model()
    vectors = encoder.encode(texts, normalize_embeddings=True)
    return [vector.astype(float).tolist() for vector in vectors]


def write_embeddings(chunks: list[Chunk], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    model = load_embedding_model()
    vectors = embed_texts([chunk.text for chunk in chunks], model=model)

    with path.open("w", encoding="utf-8") as file:
        for chunk, vector in zip(chunks, vectors):
            file.write(
                json.dumps(
                    {
                        "id": chunk.id,
                        "title": chunk.title,
                        "source": chunk.source,
                        "text": chunk.text,
                        "embedding": vector
                    },
                    ensure_ascii=True
                )
                + "\n"
            )


def read_embedding_records(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
