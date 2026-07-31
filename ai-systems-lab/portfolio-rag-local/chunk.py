from rag_lab.chunking import chunk_markdown, write_chunks
from rag_lab.config import CHUNKS_JSON, PORTFOLIO_MD


def main() -> None:
    markdown = PORTFOLIO_MD.read_text(encoding="utf-8")
    chunks = chunk_markdown(markdown)
    write_chunks(chunks, CHUNKS_JSON)
    print(f"Wrote {len(chunks)} chunks to {CHUNKS_JSON}")


if __name__ == "__main__":
    main()
