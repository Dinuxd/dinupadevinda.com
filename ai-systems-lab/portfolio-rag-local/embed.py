from rag_lab.chunking import read_chunks
from rag_lab.config import CHUNKS_JSON, EMBEDDINGS_JSONL, embedding_model_name
from rag_lab.embedding import write_embeddings


def main() -> None:
    chunks = read_chunks(CHUNKS_JSON)
    write_embeddings(chunks, EMBEDDINGS_JSONL)
    print(f"Embedded {len(chunks)} chunks with {embedding_model_name()}")
    print(f"Wrote embeddings to {EMBEDDINGS_JSONL}")


if __name__ == "__main__":
    main()
