# IntelLearn AI - FastAPI Backend API

Production-grade Python backend built with **FastAPI**, **LangChain**, **FAISS / ChromaDB Vector Store**, **PyMuPDF**, **JWT Auth**, **PostgreSQL / MongoDB**, and **Redis**.

## 🚀 Key Features

1. **Authentication (`/api/v1/auth`)**:
   - JWT Access & Refresh Token generation
   - Bcrypt password hashing
   - Google OAuth Login handler
   - Forgot & Reset Password workflow

2. **File Upload & Extraction (`/api/v1/upload`)**:
   - Supports PDF, DOCX, PPTX, TXT, Images (up to 100MB)
   - PyMuPDF (`fitz`), `python-docx`, `python-pptx` text & metadata extraction
   - Automatic DOI, authors, year, keywords parsing
   - Duplicate detection & renaming

3. **RAG Vector Database & AI Chat (`/api/v1/chat`, `/api/v1/search`)**:
   - `RecursiveCharacterTextSplitter` chunking
   - Dense embeddings with FAISS cosine vector search
   - Strictly IEEE-bound RAG completions with page citations & memory

4. **Research Analytics (`/api/v1/research`)**:
   - 15-point IEEE structural analysis & novelty score
   - Side-by-side multi-paper comparison matrix

5. **Study Tools Generator (`/api/v1/study`)**:
   - Automatic Notes (Simple, Detailed, Topic, Chapter, Unit, Important)
   - MCQ & Quiz Generator (Difficulty, Question count, 5 Question types)
   - 3D Flashcard decks

## 🛠️ Quick Local Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Access OpenAPI Documentation at: `http://localhost:8000/docs`
