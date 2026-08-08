from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from app.services.comparison_service import comparison_service

router = APIRouter(tags=["Comparison Matrix"])

class ComparisonRequest(BaseModel):
    document_ids: Optional[List[str]] = ["doc_transformer_v3", "doc_softmax_baseline", "doc_mamba_v2"]

@router.post("/comparison-matrix")
@router.post("/comparison")
async def generate_comparison(payload: ComparisonRequest):
    """Generate side-by-side benchmark comparison matrix for 2-20 research papers."""
    doc_ids = payload.document_ids or ["doc_transformer_v3", "doc_softmax_baseline", "doc_mamba_v2"]
    return await comparison_service.generate_comparison(doc_ids)
