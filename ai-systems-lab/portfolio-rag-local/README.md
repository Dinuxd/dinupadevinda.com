# Portfolio RAG Local Lab

This is the Python learning and experimentation version of the portfolio assistant. It stays intentionally small so chunking, embeddings, vector search, prompting, and evaluation can be studied independently from the deployed Worker.

## What This Demonstrates

Public Worker implementation:

```text
Question -> Gemini embedding + keyword search -> Cloudflare Vectorize -> rank fusion -> Gemini -> validated sources
```

Local Python implementation:

```text
Question -> question embedding -> Chroma vector search -> top chunks -> grounded prompt -> Gemini answer
```

## Tools

- Python for the learning code
- sentence-transformers for local embeddings
- Chroma for the local vector database
- Gemini API for answer generation
- JSON/Markdown files for transparent data and evaluation

No Pinecone, LangSmith, Databricks, or OpenAI API billing is required for this first version.

## Setup

Create a virtual environment from this folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create a local `.env` file:

```powershell
Copy-Item .env.example .env
```

Then add your Gemini key:

```text
GEMINI_API_KEY=your_key_here
```

The API key is only for local learning. Do not commit `.env`.

## Run The RAG Pipeline

1. Split the portfolio knowledge into chunks:

```powershell
python chunk.py
```

2. Create embeddings:

```powershell
python embed.py
```

3. Build the Chroma index:

```powershell
python index.py
```

4. Ask a question:

```powershell
python ask.py "What ML projects has Dinupa done?"
python ask.py "Does Dinupa have computer vision experience?"
python ask.py "How does this chatbot work?"
python ask.py "Did Dinupa work at Google?"
```

If `GEMINI_API_KEY` is missing, `ask.py` still shows the retrieved chunks so you can learn retrieval without calling an LLM.

## Evaluation

Run the evaluation harness:

```powershell
python eval/run_eval.py
```

For LLM answer checks:

```powershell
python eval/run_eval.py --with-llm
```

The report is written to:

```text
eval/report.md
```

## What To Explain In Interviews

- Chunking converts a document into smaller retrievable units.
- Embeddings convert text into numerical vectors.
- Vector search finds chunks with similar meaning to the question.
- The prompt gives the LLM only the retrieved context, not the whole site.
- Grounding means the answer should come from retrieved evidence.
- Evaluation tests whether the assistant answers correctly and refuses unsupported claims.

## Honest Limitation

This lab is for learning and offline comparison, not production hosting. Public concerns such as CORS, request limits, rate limiting, secret handling, prompt-injection checks, structured logs, and Cloudflare Vectorize live in `portfolio-chat-worker/`.
