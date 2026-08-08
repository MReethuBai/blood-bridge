from fastapi import APIRouter, Query
from app.services.research_gap_service import research_gap_service

router = APIRouter(tags=["Research Gap Analysis"])

@router.get("/research-gap")
async def analyze_research_gap(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Extract limitations, open challenges, missing experiments, and AI improvement suggestions."""
    return await research_gap_service.analyze_research_gap(document_id)
