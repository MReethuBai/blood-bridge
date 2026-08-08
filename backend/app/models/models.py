import datetime
import uuid
import enum
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"
    RESEARCHER = "researcher"

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

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
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    workspaces = relationship("Workspace", back_populates="owner", cascade="all, delete-orphan")
    papers = relationship("UploadedPaper", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("Settings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String, primary_key=True, default=lambda: f"ws_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    mode = Column(String, default="research")  # research / study
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="workspaces")
    projects = relationship("Project", back_populates="workspace", cascade="all, delete-orphan")
    papers = relationship("UploadedPaper", back_populates="workspace", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: f"proj_{uuid.uuid4().hex[:12]}")
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    workspace = relationship("Workspace", back_populates="projects")

class UploadedPaper(Base):
    __tablename__ = "uploaded_papers"

    paper_id = Column(String, primary_key=True, default=lambda: f"paper_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    workspace_id = Column(String, ForeignKey("workspaces.id"), nullable=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    file_type = Column(String, nullable=False)  # PDF, DOCX, TXT, ZIP
    mime_type = Column(String, nullable=True)
    file_hash = Column(String, nullable=True, index=True)
    
    title = Column(String, nullable=True)
    authors = Column(JSON, nullable=True, default=list)
    pages = Column(Integer, default=1)
    doi = Column(String, nullable=True, default="10.1109/2026.IEEE")
    status = Column(String, default=JobStatus.COMPLETED.value)  # pending, processing, completed, failed
    score = Column(Integer, default=98)
    
    upload_date = Column(String, default=lambda: datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="papers")
    workspace = relationship("Workspace", back_populates="papers")
    jobs = relationship("ProcessingJob", back_populates="paper", cascade="all, delete-orphan")

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String, primary_key=True, default=lambda: f"job_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    job_type = Column(String, nullable=False)  # text_extraction, faiss_indexing, mcq_generation
    status = Column(String, default=JobStatus.PENDING.value)
    progress = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    paper = relationship("UploadedPaper", back_populates="jobs")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(String, primary_key=True, default=lambda: f"chat_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_id = Column(String, nullable=True)
    workspace_id = Column(String, nullable=True)
    conversation_id = Column(String, default="conv-default", index=True)
    sender = Column(String, nullable=False)  # user / ai
    query = Column(Text, nullable=True)
    answer = Column(Text, nullable=False)
    code_block = Column(Text, nullable=True)
    citations = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: f"rep_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_id = Column(String, nullable=True)
    report_type = Column(String, nullable=False)  # ieee_analysis, summary, mcqs, flashcards
    title = Column(String, nullable=False)
    content_json = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ResearchHistory(Base):
    __tablename__ = "research_history"

    id = Column(String, primary_key=True, default=lambda: f"hist_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action_type = Column(String, nullable=False)  # upload, synthesis, export, quiz
    title = Column(String, nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    theme_mode = Column(String, default="light")  # light / dark
    accent_color = Column(String, default="#5B4BFF")
    language = Column(String, default="English (US)")
    autosave = Column(Boolean, default=True)
    notifications = Column(Boolean, default=True)
    ai_model = Column(String, default="gemini-3.5-flash")
    privacy_telemetry = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="settings")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: f"notif_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    type = Column(String, default="info")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String, primary_key=True, default=lambda: f"sess_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    refresh_token = Column(Text, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class IEEEAnalysisModel(Base):
    __tablename__ = "ieee_analyses"

    id = Column(String, primary_key=True, default=lambda: f"ieee_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    is_ieee_format = Column(Boolean, default=True)
    compliance_score = Column(Integer, default=98)
    doi_validity = Column(Boolean, default=True)
    missing_sections = Column(JSON, default=list)
    missing_references = Column(JSON, default=list)
    formatting_suggestions = Column(JSON, default=list)
    section_breakdown = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MethodologyModel(Base):
    __tablename__ = "methodologies"

    id = Column(String, primary_key=True, default=lambda: f"meth_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    research_objective = Column(Text, nullable=True)
    problem_statement = Column(Text, nullable=True)
    dataset_used = Column(Text, nullable=True)
    preprocessing = Column(Text, nullable=True)
    feature_engineering = Column(Text, nullable=True)
    algorithms_json = Column(JSON, default=list)
    architecture = Column(Text, nullable=True)
    hyperparameters = Column(JSON, default=dict)
    evaluation_metrics = Column(JSON, default=dict)
    results = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    future_work = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AlgorithmDetectionModel(Base):
    __tablename__ = "algorithm_detections"

    id = Column(String, primary_key=True, default=lambda: f"algo_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    detected_algorithms = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ResearchScoreModel(Base):
    __tablename__ = "research_scores"

    id = Column(String, primary_key=True, default=lambda: f"score_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    novelty = Column(Integer, default=96)
    readability = Column(Integer, default=94)
    writing_quality = Column(Integer, default=95)
    technical_depth = Column(Integer, default=98)
    methodology_quality = Column(Integer, default=97)
    reference_quality = Column(Integer, default=99)
    dataset_quality = Column(Integer, default=95)
    experimental_eval = Column(Integer, default=98)
    overall_score = Column(Integer, default=98)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class NoveltyDetectionModel(Base):
    __tablename__ = "novelty_detections"

    id = Column(String, primary_key=True, default=lambda: f"nov_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    novelty_percentage = Column(Float, default=96.0)
    similarity_percentage = Column(Float, default=4.0)
    repeated_content = Column(JSON, default=list)
    unique_contributions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ResearchGapModel(Base):
    __tablename__ = "research_gaps"

    id = Column(String, primary_key=True, default=lambda: f"gap_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    limitations = Column(JSON, default=list)
    future_scope = Column(JSON, default=list)
    open_challenges = Column(JSON, default=list)
    missing_experiments = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ComparisonMatrixModel(Base):
    __tablename__ = "comparison_matrices"

    id = Column(String, primary_key=True, default=lambda: f"comp_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_ids = Column(JSON, default=list)
    matrix_data = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CitationModel(Base):
    __tablename__ = "citations"

    id = Column(String, primary_key=True, default=lambda: f"cite_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, ForeignKey("uploaded_papers.paper_id"), nullable=False)
    ieee = Column(Text, nullable=False)
    apa = Column(Text, nullable=False)
    mla = Column(Text, nullable=False)
    harvard = Column(Text, nullable=False)
    chicago = Column(Text, nullable=False)
    bibtex = Column(Text, nullable=False)
    ris = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MCQItemModel(Base):
    __tablename__ = "mcq_items"

    id = Column(String, primary_key=True, default=lambda: f"mcq_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, nullable=True)
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)
    correct_index = Column(Integer, nullable=False)
    explanation = Column(Text, nullable=False)
    difficulty = Column(String, default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FlashcardItemModel(Base):
    __tablename__ = "flashcard_items"

    id = Column(String, primary_key=True, default=lambda: f"fc_{uuid.uuid4().hex[:12]}")
    paper_id = Column(String, nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    topic = Column(String, default="General")
    difficulty = Column(String, default="Medium")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuizSessionModel(Base):
    __tablename__ = "quiz_sessions"

    id = Column(String, primary_key=True, default=lambda: f"qz_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    time_spent_seconds = Column(Integer, default=180)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class NoteModel(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, default=lambda: f"note_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_id = Column(String, nullable=True)
    folder = Column(String, default="General Notes")
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    mode = Column(String, default="detailed")
    is_bookmarked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class StickyNoteModel(Base):
    __tablename__ = "sticky_notes"

    id = Column(String, primary_key=True, default=lambda: f"sticky_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    color = Column(String, default="yellow")
    position_x = Column(Integer, default=100)
    position_y = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BookmarkModel(Base):
    __tablename__ = "bookmarks"

    id = Column(String, primary_key=True, default=lambda: f"bm_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    page_number = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AnnotationModel(Base):
    __tablename__ = "annotations"

    id = Column(String, primary_key=True, default=lambda: f"ann_{uuid.uuid4().hex[:12]}")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paper_id = Column(String, nullable=False)
    selected_text = Column(Text, nullable=False)
    comment = Column(Text, nullable=True)
    color = Column(String, default="#FFFF00")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


