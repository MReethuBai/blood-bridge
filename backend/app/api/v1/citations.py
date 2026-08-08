from fastapi import APIRouter, Query
from app.services.citation_service import citation_service

router = APIRouter(tags=["Citation Generator"])

@router.get("/citations")
async def generate_citations(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Generate citations in 7 standards (IEEE, APA, MLA, Harvard, Chicago, BibTeX, RIS)."""
    return await citation_service.generate_citations(document_id)
