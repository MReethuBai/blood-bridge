from fastapi import APIRouter, Query
from app.services.summary_service import summary_service

router = APIRouter(prefix="/summary", tags=["Summarization Engine"])

@router.get("/")
@router.get("/generate")
async def generate_summary(
    document_id: str = Query("doc_transformer_v3", description="Document ID to summarize"),
    type: str = Query("bullet", description="Type: short, detailed, technical, beginner, bullet, mindmap")
):
    """
    Generate summaries strictly derived from uploaded paper context.
    Types: short, detailed, technical, beginner, bullet, mindmap
    """
    return await summary_service.generate_summary(document_id, type)
