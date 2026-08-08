from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(tags=["Authentication"])

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@router.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    """User Signup Endpoint."""
    service = AuthService(db)
    return await service.register_user(user_in)

@router.post("/login", response_model=TokenResponse)
@router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """User Login Endpoint issuing JWT Access & Refresh Tokens."""
    service = AuthService(db)
    return await service.authenticate_user(credentials)

@router.post("/logout")
@router.post("/auth/logout")
async def logout():
    """User Logout Endpoint."""
    return {"message": "Logged out successfully."}
