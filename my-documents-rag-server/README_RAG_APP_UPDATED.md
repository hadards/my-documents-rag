
# 🧠 Local RAG Document Q&A App

This is a full-stack Retrieval-Augmented Generation (RAG) application that allows you to upload `.docx` documents, embed them locally using Hugging Face models, store them in ChromaDB, and query them using a local LLM (Ollama).

---

## 📐 Architecture Flow

```
📄  You upload a .docx file from Angular
    ↳ Angular UI sends the file to FastAPI (/upload)

🧠  Hugging Face creates vector embeddings of the document text
    ↳ Converts your text into a semantic vector using a lightweight model

📦  ChromaDB stores those vectors and tags them with document metadata
    ↳ A local, fast vector database optimized for semantic search

❓  You ask a question in the chat UI and select relevant documents
    ↳ Angular sends the question + selected document filenames to FastAPI (/ask)

🧠  Hugging Face embeds the question into a vector too
    ↳ This lets Chroma compare the *meaning* of your question to stored document chunks

🔍  ChromaDB searches for the most similar chunks from selected documents
    ↳ It finds the top N chunks that are closest in meaning to your question

🤖  Ollama (local LLM) reads those chunks and generates an answer
    ↳ Uses a local model (like `llama3`) to understand the context and generate a human-like response

💬  FastAPI sends the final answer back to Angular
    ↳ Angular displays it in the chat, right under your question
```

---

## 🧰 Tech Stack

| Component | Tool | Role |
|----------|------|------|
| UI | Angular | Upload docs, ask questions |
| Backend | FastAPI | Receives/upload/process requests |
| Embedding | Hugging Face | Turns text into semantic vectors |
| Vector DB | ChromaDB | Stores and retrieves relevant chunks |
| LLM | Ollama (LLaMA3) | Generates natural-language answers |
| Orchestration | LangChain | Connects retriever (Chroma) + LLM (Ollama) in a QA chain |

---

## 🔎 What is LangChain Doing?

LangChain is the **glue** between the vector store and the LLM. It:
- Creates a `Retriever` using ChromaDB
- Feeds the results into an LLM (Ollama)
- Handles the QA loop using `RetrievalQA` chain

> Without LangChain, you'd have to manually embed, search, select, format, and query LLMs. LangChain automates that.

---

## 🚀 How to Run (Backend)

### 1. Install dependencies

```bash
pip install fastapi uvicorn langchain-community chromadb sentence-transformers python-multipart langchain-openai
```

### 2. Install and start Ollama

```bash
ollama run llama3
```

Keep it running in the background.

### 3. Start FastAPI

```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

---

## 💻 How to Run (Frontend - Angular)

```bash
cd frontend
npm install
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

---

## 📁 Folder Structure

```
/my-documents-rag-server
├── main.py              # FastAPI backend
├── uploaded_docs/       # Uploaded Word files
├── chroma_db/           # Local vector DB storage
├── requirements.txt     # Optional dependency list
└── frontend/            # Angular app
```

---

## 🧪 Example Question

> Upload your CV and ask:  
> "What programming languages are mentioned?"

✅ You'll get a real answer, not the whole document.

---

## 🧠 RAG Pipeline Design Diagram

```
[ Angular UI ]
     ↓ Upload / Ask
[ FastAPI Backend ]
     ↓
[ Docx2txtLoader → Hugging Face Embedding ]
     ↓
[ ChromaDB (Vector DB) ]
     ↓ Top K chunks
[ LangChain Retriever ]
     ↓
[ Ollama (LLM: llama3) ]
     ↓
[ Final Answer to Angular UI ]
```

---

## ✅ Future Ideas

- Add PDF support
- Use local Hugging Face LLMs
- Multi-user accounts / file separation
- Document versioning
