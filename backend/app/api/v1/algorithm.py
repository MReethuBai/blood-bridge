from fastapi import APIRouter, Query
from app.services.algorithm_detector import algorithm_detector

router = APIRouter(prefix="/algorithm", tags=["Algorithm Detector"])

@router.get("/detect")
async def detect_algorithms(document_id: str = Query("doc_transformer_v3", description="Document ID")):
    """Detect and highlight Machine Learning & Deep Learning algorithms in paper text."""
    return await algorithm_detector.detect_algorithms(document_id)
