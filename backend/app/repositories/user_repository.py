from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.models.models import User, Settings

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)

        # Initialize default settings for user
        user_settings = Settings(
            user_id=user.id,
            theme_mode="light",
            accent_color="#5B4BFF",
            language="English (US)",
            autosave=True,
            notifications=True,
            ai_model="gemini-3.5-flash"
        )
        self.db.add(user_settings)
        await self.db.commit()
        return user
