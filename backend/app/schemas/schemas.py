from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any

# Authentication & User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = "Researcher User"
    role: Optional[str] = "researcher"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"

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

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None

# Workspace & Project Schemas
class WorkspaceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    mode: Optional[str] = "research"

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    mode: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: str
    user_id: int
    name: str
    description: Optional[str]
    mode: str
    created_at: Any

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    workspace_id: str
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True

# Paper & Document Schemas
class PaperMetadata(BaseModel):
    doi: Optional[str] = None
    authors: Optional[List[str]] = []
    publication_year: Optional[int] = 2026
    journal: Optional[str] = "IEEE Transactions"

class PaperResponse(BaseModel):
    paper_id: str
    filename: str
    file_size_bytes: int
    file_type: str
    title: Optional[str]
    authors: Optional[List[str]]
    pages: int
    doi: Optional[str]
    status: str
    score: int
    upload_date: str

    class Config:
        from_attributes = True

# Dashboard Aggregated Stats
class DashboardStatsResponse(BaseModel):
    total_papers: int
    total_notes: int
    total_mcqs: int
    study_hours: float
    recent_papers: List[PaperResponse]
    recent_activities: List[Dict[str, Any]]
    workspaces: List[WorkspaceResponse]

# Settings Schemas
class SettingsUpdate(BaseModel):
    theme_mode: Optional[str] = None
    accent_color: Optional[str] = None
    language: Optional[str] = None
    autosave: Optional[bool] = None
    notifications: Optional[bool] = None
    ai_model: Optional[str] = None
    privacy_telemetry: Optional[bool] = None

class SettingsResponse(BaseModel):
    theme_mode: str
    accent_color: str
    language: str
    autosave: bool
    notifications: bool
    ai_model: str
    privacy_telemetry: bool

    class Config:
        from_attributes = True
