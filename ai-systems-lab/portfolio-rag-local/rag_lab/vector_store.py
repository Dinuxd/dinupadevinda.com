from __future__ import annotations

import chromadb

from rag_lab.config import CHROMA_DIR, COLLECTION_NAME


def get_collection(reset: bool = False):
    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    if reset:
        try:
            client.delete_collection(COLLECTION_NAME)
        except ValueError:
            pass

    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Dinupa Devinda portfolio RAG chunks"}
    )


def index_records(records: list[dict]) -> int:
    collection = get_collection(reset=True)
    if not records:
        return 0

    collection.add(
        ids=[record["id"] for record in records],
        documents=[record["text"] for record in records],
        metadatas=[
            {
                "title": record["title"],
                "source": record["source"]
            }
            for record in records
        ],
        embeddings=[record["embedding"] for record in records]
    )
    return len(records)


def query_records(question_embedding: list[float], top_k: int = 4) -> list[dict]:
    collection = get_collection(reset=False)
    result = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )

    documents = result.get("documents", [[]])[0]
    metadatas = result.get("metadatas", [[]])[0]
    distances = result.get("distances", [[]])[0]
    ids = result.get("ids", [[]])[0]

    records: list[dict] = []
    for index, document in enumerate(documents):
        metadata = metadatas[index] or {}
        records.append(
            {
                "id": ids[index],
                "title": metadata.get("title", "Untitled source"),
                "source": metadata.get("source", "portfolio"),
                "text": document,
                "distance": distances[index]
            }
        )

    return records
