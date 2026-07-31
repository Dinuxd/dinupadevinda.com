from __future__ import annotations

import os
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT_DIR / "data"
ARTIFACT_DIR = ROOT_DIR / "artifacts"
CHROMA_DIR = ROOT_DIR / "chroma_db"

PORTFOLIO_MD = DATA_DIR / "portfolio.md"
CHUNKS_JSON = ARTIFACT_DIR / "chunks.json"
EMBEDDINGS_JSONL = ARTIFACT_DIR / "embeddings.jsonl"
EVAL_REPORT = ROOT_DIR / "eval" / "report.md"

DEFAULT_EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DEFAULT_GEMINI_MODEL = "gemini-3.5-flash"
COLLECTION_NAME = "dinupa_portfolio_chunks"


def load_local_env() -> None:
    """Load simple KEY=value pairs from .env without adding another dependency."""
    env_path = ROOT_DIR / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def embedding_model_name() -> str:
    return os.getenv("EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL)


def gemini_model_name() -> str:
    return os.getenv("GEMINI_MODEL", DEFAULT_GEMINI_MODEL)
