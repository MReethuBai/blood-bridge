from fastapi import APIRouter, Query
from app.services.methodology_service import methodology_service

router = APIRouter(prefix="/methodology", tags=["Methodology Extraction"])

@router.get("/")
@router.get("/extract")
async def extract_methodology(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Extract structured 14-field research methodology & dataset parameters."""
    return await methodology_service.extract_methodology(document_id)
