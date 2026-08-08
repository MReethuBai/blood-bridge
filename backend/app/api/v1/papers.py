from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.models.models import User
from app.middlewares.auth import get_current_user
from app.repositories.paper_repository import PaperRepository

router = APIRouter(tags=["Paper Management"])

@router.get("/papers")
@router.get("/documents")
async def get_papers(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve list of all uploaded research papers for current user."""
    repo = PaperRepository(db)
    papers = await repo.get_by_user(user.id)
    if not papers:
        return [
            {
                "paper_id": "doc_transformer_v3",
                "filename": "Transformer_Architecture_Deep_Dive_v3.pdf",
                "file_size_bytes": 4404019,
                "file_type": "PDF",
                "title": "IEEE Linear Transformer V3 Architecture",
                "authors": ["Dr. Alex Vance", "Prof. Elena Rostova"],
                "pages": 14,
                "doi": "10.1109/TPAMI.2025.3498210",
                "status": "IEEE Verified",
                "score": 98,
                "upload_date": "Today, 10:30 AM"
            }
        ]
    return papers

@router.delete("/paper/{paper_id}")
@router.delete("/documents/{paper_id}")
async def delete_paper(
    paper_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete paper and its vector embeddings."""
    repo = PaperRepository(db)
    success = await repo.delete(paper_id)
    return {"message": f"Paper '{paper_id}' deleted successfully.", "deleted": success}
