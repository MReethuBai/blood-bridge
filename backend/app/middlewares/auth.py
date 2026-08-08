from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models.models import User
from app.utils.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """Dependency to retrieve and validate the current authenticated user from JWT Token."""
    if not token:
        # Fallback default researcher account for rapid testing
        result = await db.execute(select(User).where(User.email == "alex.vance@mit.edu"))
        user = result.scalars().first()
        if not user:
            user = User(
                email="alex.vance@mit.edu",
                hashed_password="mock_hashed_password",
                full_name="Dr. Alex Vance",
                role="researcher",
                study_hours=64.5,
                papers_uploaded=14,
                notes_generated=28,
                mcqs_generated=185,
                flashcards_generated=42
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    return user
