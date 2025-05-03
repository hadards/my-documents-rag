
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
import os
import shutil

# Import a custom function that returns a language model (Ollama or OpenAI)
from my_llm import get_llm

# Initialize FastAPI app
app = FastAPI()

# Define paths for uploaded docs and ChromaDB storage
DOC_DIR = "uploaded_docs"
CHROMA_DIR = "chroma_db"
os.makedirs(DOC_DIR, exist_ok=True)
os.makedirs(CHROMA_DIR, exist_ok=True)

# Enable CORS so Angular frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a local Hugging Face model to convert text into embedding vectors
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Upload and index a .docx file
@app.post("/upload")
async def upload_document(document: UploadFile = File(...)):
    # Save uploaded file to disk
    filepath = os.path.join(DOC_DIR, document.filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(document.file, f)

    # Extract raw text from the .docx file
    loader = Docx2txtLoader(filepath)
    docs = loader.load()

    # Attach the filename as metadata for later filtering
    for doc in docs:
        doc.metadata["source"] = document.filename

    # Convert to embeddings and store in ChromaDB
    Chroma.from_documents(docs, embedding=embeddings, persist_directory=CHROMA_DIR)

    return {"message": f"{document.filename} uploaded and indexed."}

# Handle user questions with RAG pipeline
@app.post("/ask")
async def ask_question(request: Request):
    # Get question and selected document filenames from the request
    body = await request.json()
    question = body.get("question")
    document_ids = body.get("documentIds", [])

    # Load Chroma vector DB with the same embedding model
    vectordb = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)

    # Create a retriever that only returns chunks from selected documents
    retriever = vectordb.as_retriever(
        search_kwargs={
            "k": 10,  # top 10 most similar chunks
            "filter": {"source": {"$in": document_ids}}  # only from selected files
        }
    )

    # Get the language model (Ollama or OpenAI)
    llm = get_llm()

    # Combine retriever + LLM using LangChain's RetrievalQA
    chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

    # Run the question through the RAG chain and return the answer
    answer = chain.run(question)
    return JSONResponse(content={"answer": answer})

# Return a list of available documents (for Angular to show checkboxes)
@app.get("/documents")
def list_uploaded_documents():
    files = os.listdir(DOC_DIR)
    return [{"id": f, "name": f} for f in files if f.endswith(".docx")]
