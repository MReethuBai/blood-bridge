from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.models import User
from app.middlewares.auth import get_current_user
from app.schemas.schemas import UserResponse, ProfileUpdate

router = APIRouter(tags=["User Profile"])

@router.get("/profile", response_model=UserResponse)
@router.get("/profile/me", response_model=UserResponse)
async def get_profile(user: User = Depends(get_current_user)):
    """Retrieve current authenticated user profile."""
    return user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update profile information (full_name, avatar_url, role)."""
    if payload.full_name:
        user.full_name = payload.full_name
    if payload.avatar_url:
        user.avatar_url = payload.avatar_url
    if payload.role:
        user.role = payload.role

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/profile")
async def delete_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete user account and all associated data."""
    await db.delete(user)
    await db.commit()
    return {"message": "User account deleted successfully."}
