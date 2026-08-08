from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.models.models import Workspace, Project

class WorkspaceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user(self, user_id: int) -> List[Workspace]:
        result = await self.db.execute(
            select(Workspace)
            .where(Workspace.user_id == user_id)
            .order_by(Workspace.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, workspace_id: str) -> Optional[Workspace]:
        result = await self.db.execute(
            select(Workspace).where(Workspace.id == workspace_id)
        )
        return result.scalars().first()

    async def create(self, workspace: Workspace) -> Workspace:
        self.db.add(workspace)
        await self.db.commit()
        await self.db.refresh(workspace)
        return workspace

    async def delete(self, workspace_id: str) -> bool:
        ws = await self.get_by_id(workspace_id)
        if ws:
            await self.db.delete(ws)
            await self.db.commit()
            return True
        return False
