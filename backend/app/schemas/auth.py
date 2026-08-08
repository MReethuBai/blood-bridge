from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = "Researcher User"
    role: Optional[str] = "researcher"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleOAuthLogin(BaseModel):
    id_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    role: str
    avatar_url: Optional[str]
    study_hours: float
    papers_uploaded: int
    notes_generated: int
    mcqs_generated: int
    flashcards_generated: int
    is_verified: bool

    class Config:
        from_attributes = True
