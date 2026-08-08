from fastapi import APIRouter, Query
from app.services.ieee_analysis_service import ieee_analysis_service

router = APIRouter(prefix="/ieee", tags=["IEEE Paper Analysis"])

@router.get("/analysis")
@router.get("/validation")
async def analyze_ieee_paper(document_id: str = Query("doc_transformer_v3", description="Document ID to analyze")):
    """Perform 19-point IEEE paper analysis, format validation, and compliance scoring."""
    return await ieee_analysis_service.analyze_ieee_paper(document_id)
