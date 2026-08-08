from fastapi import APIRouter, UploadFile, File, Depends, Form
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.models import User
from app.middlewares.auth import get_current_user
from app.services.paper_service import PaperService

router = APIRouter(tags=["File Uploads"])

@router.post("/upload")
@router.post("/upload/paper")
async def upload_files(
    files: List[UploadFile] = File(...),
    workspace_id: Optional[str] = Form("ws_default"),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Multiple File Upload Endpoint.
    Supports uploading up to 100 files simultaneously (PDF, DOCX, TXT, ZIP, Images up to 100MB per file).
    Performs duplicate hashing, folder organization, metadata parsing, and RAG vector indexing.
    """
    service = PaperService(db)
    if len(files) == 1:
        paper = await service.process_single_upload(files[0], user, workspace_id)
        return {
            "message": f"Uploaded '{paper.filename}' successfully.",
            "paper": paper
        }

    papers = await service.process_multiple_uploads(files, user, workspace_id)
    return {
        "message": f"Successfully uploaded {len(papers)} papers.",
        "papers": papers
    }
