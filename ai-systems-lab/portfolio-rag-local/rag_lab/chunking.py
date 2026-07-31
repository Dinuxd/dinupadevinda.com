from __future__ import annotations

import hashlib
import json
import re
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class Chunk:
    id: str
    title: str
    source: str
    text: str


HEADING_PATTERN = re.compile(r"^(#{1,3})\s+(.+)$")


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return cleaned or "section"


def stable_id(title: str, text: str) -> str:
    digest = hashlib.sha1(f"{title}\n{text}".encode("utf-8")).hexdigest()[:10]
    return f"{slugify(title)}-{digest}"


def chunk_markdown(markdown: str, max_chars: int = 1300) -> list[Chunk]:
    """Split Markdown by headings, then split long sections into smaller chunks."""
    sections: list[tuple[str, list[str]]] = []
    current_title = "Portfolio overview"
    current_lines: list[str] = []

    for line in markdown.splitlines():
        heading = HEADING_PATTERN.match(line)
        if heading:
            if current_lines:
                sections.append((current_title, current_lines))
            current_title = heading.group(2).strip()
            current_lines = [line]
            continue
        current_lines.append(line)

    if current_lines:
        sections.append((current_title, current_lines))

    chunks: list[Chunk] = []
    for title, lines in sections:
        text = "\n".join(lines).strip()
        for part_index, part in enumerate(split_text(text, max_chars=max_chars), start=1):
            chunk_title = title if len(text) <= max_chars else f"{title} part {part_index}"
            chunks.append(
                Chunk(
                    id=stable_id(chunk_title, part),
                    title=chunk_title,
                    source=slugify(title),
                    text=part
                )
            )

    return chunks


def split_text(text: str, max_chars: int) -> list[str]:
    if len(text) <= max_chars:
        return [text]

    paragraphs = [paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip()]
    parts: list[str] = []
    current: list[str] = []
    current_len = 0

    for paragraph in paragraphs:
        next_len = current_len + len(paragraph) + 2
        if current and next_len > max_chars:
            parts.append("\n\n".join(current))
            current = [paragraph]
            current_len = len(paragraph)
        else:
            current.append(paragraph)
            current_len = next_len

    if current:
        parts.append("\n\n".join(current))

    return parts


def write_chunks(chunks: list[Chunk], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps([asdict(chunk) for chunk in chunks], indent=2, ensure_ascii=True),
        encoding="utf-8"
    )


def read_chunks(path: Path) -> list[Chunk]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return [Chunk(**item) for item in data]
