from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class DocumentMetadata(BaseModel):
    doi: Optional[str] = None
    authors: Optional[List[str]] = []
    publication_year: Optional[int] = 2025
    journal: Optional[str] = "IEEE Transactions"
    keywords: Optional[List[str]] = []
    page_count: int = 1

class DocumentResponse(BaseModel):
    document_id: str
    filename: str
    file_size_bytes: int
    file_type: str
    upload_date: str
    status: str = "IEEE Verified"
    score: int = 98
    metadata: DocumentMetadata

class ChunkResponse(BaseModel):
    chunk_id: str
    document_id: str
    page_number: int
    content: str
    section: Optional[str] = "Methodology"
    similarity_score: Optional[float] = 0.96
