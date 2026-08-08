from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.models.models import UploadedPaper

class PaperRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user(self, user_id: int) -> List[UploadedPaper]:
        result = await self.db.execute(
            select(UploadedPaper)
            .where(UploadedPaper.user_id == user_id)
            .order_by(UploadedPaper.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, paper_id: str) -> Optional[UploadedPaper]:
        result = await self.db.execute(
            select(UploadedPaper).where(UploadedPaper.paper_id == paper_id)
        )
        return result.scalars().first()

    async def find_by_hash(self, file_hash: str) -> Optional[UploadedPaper]:
        result = await self.db.execute(
            select(UploadedPaper).where(UploadedPaper.file_hash == file_hash)
        )
        return result.scalars().first()

    async def create(self, paper: UploadedPaper) -> UploadedPaper:
        self.db.add(paper)
        await self.db.commit()
        await self.db.refresh(paper)
        return paper

    async def delete(self, paper_id: str) -> bool:
        paper = await self.get_by_id(paper_id)
        if paper:
            await self.db.delete(paper)
            await self.db.commit()
            return True
        return False
