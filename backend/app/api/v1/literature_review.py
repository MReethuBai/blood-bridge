from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from app.services.literature_review_service import literature_review_service

router = APIRouter(tags=["Literature Review"])

class LiteratureReviewRequest(BaseModel):
    document_ids: Optional[List[str]] = ["doc_transformer_v3"]

@router.post("/literature-review")
async def generate_literature_review(payload: LiteratureReviewRequest):
    """Synthesize multi-paper Literature Reviews."""
    doc_ids = payload.document_ids or ["doc_transformer_v3"]
    return await literature_review_service.generate_literature_review(doc_ids)
