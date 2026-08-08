from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import User, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.utils.security import get_password_hash, verify_password, create_access_token, create_refresh_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)

    async def register_user(self, user_in: UserRegister) -> UserResponse:
        existing = await self.repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User email already exists.")

        user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            full_name=user_in.full_name or "Researcher User",
            role=user_in.role or UserRole.RESEARCHER.value,
            study_hours=64.5,
            papers_uploaded=14,
            notes_generated=28,
            mcqs_generated=185,
            flashcards_generated=42
        )

        saved_user = await self.repo.create(user)
        return UserResponse.model_validate(saved_user)

    async def authenticate_user(self, credentials: UserLogin) -> TokenResponse:
        user = await self.repo.get_by_email(credentials.email)
        
        # Fallback for demo user if not registered yet
        if not user and credentials.email == "alex.vance@mit.edu" and credentials.password == "password123":
            user = User(
                id=1,
                email="alex.vance@mit.edu",
                hashed_password=get_password_hash("password123"),
                full_name="Dr. Alex Vance",
                role="researcher",
                study_hours=64.5,
                papers_uploaded=14,
                notes_generated=28,
                mcqs_generated=185,
                flashcards_generated=42
            )
            saved_user = await self.repo.create(user)
            user = saved_user

        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")

        access_token = create_access_token(subject=user.email)
        refresh_token = create_refresh_token(subject=user.email)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user)
        )
