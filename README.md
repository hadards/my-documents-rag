
# My Documents RAG App

This is a full-stack Retrieval-Augmented Generation (RAG) application built for private, local document Q&A.

## Stack

- **Angular** frontend for uploading DOCX files and chatting
- **FastAPI** backend for handling uploads and LLM queries
- **ChromaDB** for storing vector embeddings
- **HuggingFace** for generating embeddings locally
- **Ollama** for answering questions with LLaMA3 locally
- **LangChain** to wire embeddings, vector search, and LLM into a unified chain

## Project Structure

```
my-documents-rag/
├── my-documents-rag-client/     # Angular frontend
└── my-documents-rag-server/     # Python FastAPI backend
```

## How it works

1. User uploads DOCX → sent to FastAPI
2. HuggingFace turns text into vector embeddings
3. Vectors are stored in local ChromaDB
4. User asks question → FastAPI embeds the question
5. Chroma finds similar chunks
6. Ollama (via LangChain) reads chunks and answers
7. Response is returned to Angular and shown in the chat UI

## How to Run

### Backend (FastAPI)

```bash
cd my-documents-rag-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (Angular)

```bash
cd my-documents-rag-client
npm install
ng serve --open
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.
