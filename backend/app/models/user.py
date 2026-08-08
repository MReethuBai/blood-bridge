import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Enum as SQLEnum
import enum
from app.db.postgres import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"
    RESEARCHER = "researcher"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True, default="Researcher User")
    role = Column(String, default=UserRole.RESEARCHER.value)
    avatar_url = Column(String, nullable=True, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb")
    
    # Profile & Activity Stats
    study_hours = Column(Float, default=0.0)
    papers_uploaded = Column(Integer, default=0)
    notes_generated = Column(Integer, default=0)
    mcqs_generated = Column(Integer, default=0)
    flashcards_generated = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
