from rag_lab.config import EMBEDDINGS_JSONL
from rag_lab.embedding import read_embedding_records
from rag_lab.vector_store import index_records


def main() -> None:
    records = read_embedding_records(EMBEDDINGS_JSONL)
    count = index_records(records)
    print(f"Indexed {count} chunks in the local Chroma vector database")


if __name__ == "__main__":
    main()
