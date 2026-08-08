from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.models import User, Settings
from app.middlewares.auth import get_current_user
from app.schemas.schemas import SettingsUpdate, SettingsResponse

router = APIRouter(tags=["Workspace Settings"])

@router.get("/settings", response_model=SettingsResponse)
async def get_settings(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve Notion-style workspace settings."""
    result = await db.execute(select(Settings).where(Settings.user_id == user.id))
    user_settings = result.scalars().first()
    if not user_settings:
        user_settings = Settings(
            user_id=user.id,
            theme_mode="light",
            accent_color="#5B4BFF",
            language="English (US)",
            autosave=True,
            notifications=True,
            ai_model="gemini-3.5-flash",
            privacy_telemetry=False
        )
        db.add(user_settings)
        await db.commit()
        await db.refresh(user_settings)
    return user_settings

@router.put("/settings", response_model=SettingsResponse)
async def update_settings(
    payload: SettingsUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Save and update workspace settings."""
    result = await db.execute(select(Settings).where(Settings.user_id == user.id))
    user_settings = result.scalars().first()
    if not user_settings:
        user_settings = Settings(user_id=user.id)
        db.add(user_settings)

    if payload.theme_mode is not None:
        user_settings.theme_mode = payload.theme_mode
    if payload.accent_color is not None:
        user_settings.accent_color = payload.accent_color
    if payload.language is not None:
        user_settings.language = payload.language
    if payload.autosave is not None:
        user_settings.autosave = payload.autosave
    if payload.notifications is not None:
        user_settings.notifications = payload.notifications
    if payload.ai_model is not None:
        user_settings.ai_model = payload.ai_model
    if payload.privacy_telemetry is not None:
        user_settings.privacy_telemetry = payload.privacy_telemetry

    await db.commit()
    await db.refresh(user_settings)
    return user_settings
