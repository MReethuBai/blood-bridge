from fastapi import APIRouter, Query
from app.services.research_score_service import research_score_service

router = APIRouter(tags=["Research Score"])

@router.get("/research-score")
@router.get("/score")
async def get_research_score(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Calculate 12-dimensional Research Quality Score (0-100)."""
    return await research_score_service.calculate_score(document_id)
