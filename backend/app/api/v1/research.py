from fastapi import APIRouter
from app.schemas.research import ComparisonMatrixRequest
from app.services.research_service import research_service

router = APIRouter(prefix="/research", tags=["Research Analytics"])

@router.get("/ieee-analysis")
async def ieee_analysis(document_id: str = "doc_transformer_v3"):
    """Get 15-point IEEE structural analysis & novelty score breakdown."""
    return await research_service.get_ieee_analysis(document_id)

@router.post("/comparison-matrix")
async def comparison_matrix(payload: ComparisonMatrixRequest):
    """Generate side-by-side paper comparison matrix across dataset, algorithm, accuracy & novelty."""
    return await research_service.get_comparison_matrix(payload.document_ids)
