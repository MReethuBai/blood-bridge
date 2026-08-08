from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.database import get_db
from app.models.models import User, Workspace
from app.middlewares.auth import get_current_user
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceResponse

router = APIRouter(tags=["Workspace Management"])

@router.get("/workspaces", response_model=List[WorkspaceResponse])
async def get_workspaces(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all workspaces belonging to the authenticated user."""
    repo = WorkspaceRepository(db)
    workspaces = await repo.get_by_user(user.id)
    if not workspaces:
        # Default workspaces if none created yet
        ws1 = Workspace(id="ws_1", user_id=user.id, name="IEEE AI & Machine Learning Lab", description="Primary workspace for neural architecture research", mode="research")
        ws2 = Workspace(id="ws_2", user_id=user.id, name="Biochemistry Study Deck", description="MCQs and flashcards for exam preparation", mode="study")
        await repo.create(ws1)
        await repo.create(ws2)
        workspaces = [ws1, ws2]
    return workspaces

@router.post("/workspace", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    payload: WorkspaceCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workspace."""
    repo = WorkspaceRepository(db)
    workspace = Workspace(
        user_id=user.id,
        name=payload.name,
        description=payload.description,
        mode=payload.mode or "research"
    )
    return await repo.create(workspace)

@router.put("/workspace/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: str,
    payload: WorkspaceUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update workspace details."""
    repo = WorkspaceRepository(db)
    ws = await repo.get_by_id(workspace_id)
    if not ws or ws.user_id != user.id:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    
    if payload.name:
        ws.name = payload.name
    if payload.description:
        ws.description = payload.description
    if payload.mode:
        ws.mode = payload.mode

    await db.commit()
    await db.refresh(ws)
    return ws

@router.delete("/workspace/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete workspace."""
    repo = WorkspaceRepository(db)
    success = await repo.delete(workspace_id)
    return {"message": f"Workspace '{workspace_id}' deleted.", "success": success}
