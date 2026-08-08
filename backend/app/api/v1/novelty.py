from fastapi import APIRouter, Query
from app.services.novelty_service import novelty_service

router = APIRouter(tags=["Novelty Detection"])

@router.get("/novelty")
async def analyze_novelty(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Perform semantic similarity & vector comparison for novelty detection."""
    return await novelty_service.analyze_novelty(document_id)
