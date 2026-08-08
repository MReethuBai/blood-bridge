from fastapi import APIRouter, Response, Path
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.multi_export_service import multi_export_service

router = APIRouter(prefix="/export", tags=["Multi-Format Export Engine"])

class ExportRequest(BaseModel):
    data: Optional[Dict[str, Any]] = {"title": "IEEE Research Synthesis"}

@router.post("/{format_type}")
async def export_report(
    format_type: str = Path(..., description="Format: pdf, docx, markdown, excel, csv"),
    payload: Optional[ExportRequest] = None
):
    """Export research reports, comparison matrices, and study decks in PDF, DOCX, Markdown, Excel, or CSV."""
    fmt = format_type.lower()
    report_data = payload.data if payload and payload.data else {"title": "IEEE Research Synthesis"}
    content_bytes = await multi_export_service.export_report(report_data, fmt)

    media_types = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "markdown": "text/markdown",
        "md": "text/markdown",
        "excel": "text/csv",
        "xlsx": "text/csv",
        "csv": "text/csv"
    }

    ext_map = {
        "pdf": "pdf",
        "docx": "docx",
        "markdown": "md",
        "md": "md",
        "excel": "csv",
        "xlsx": "csv",
        "csv": "csv"
    }

    m_type = media_types.get(fmt, "application/octet-stream")
    ext = ext_map.get(fmt, fmt)

    return Response(
        content=content_bytes,
        media_type=m_type,
        headers={"Content-Disposition": f'attachment; filename="IEEE_Synthesis_Report.{ext}"'}
    )
