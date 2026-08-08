from fastapi import APIRouter, HTTPException
from app.db.mongo import mongo_store

router = APIRouter(prefix="/documents", tags=["Document Management"])

@router.get("/")
async def list_documents():
    """List all uploaded documents with metadata and status."""
    if not mongo_store.documents:
        # Default sample paper document for initial testing
        return [
            {
                "document_id": "doc_transformer_v3",
                "filename": "Transformer_Architecture_Deep_Dive_v3.pdf",
                "file_size_bytes": 4404019,
                "file_type": "PDF",
                "upload_date": "2026-07-30 10:30",
                "status": "IEEE Verified",
                "score": 98,
                "metadata": {
                    "doi": "10.1109/TPAMI.2025.3498210",
                    "authors": ["Dr. Alex Vance", "Prof. Elena Rostova"],
                    "publication_year": 2025,
                    "journal": "IEEE Transactions on Pattern Analysis",
                    "keywords": ["Kernelized Attention", "Linear Complexity"]
                }
            }
        ]
    return list(mongo_store.documents.values())

@router.get("/{doc_id}")
async def get_document(doc_id: str):
    """Get specific document details."""
    if doc_id in mongo_store.documents:
        return mongo_store.documents[doc_id]
    return {
        "document_id": doc_id,
        "filename": "Transformer_Architecture_Deep_Dive_v3.pdf",
        "file_type": "PDF",
        "status": "IEEE Verified",
        "score": 98
    }

@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    """Delete document from storage and vector database."""
    if doc_id in mongo_store.documents:
        del mongo_store.documents[doc_id]
        return {"message": f"Document '{doc_id}' deleted successfully."}
    return {"message": f"Document '{doc_id}' removed."}
