import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "IntelLearn AI Backend"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "intellearn_super_secret_jwt_key_2026_change_in_prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Databases
    POSTGRES_URI: str = "sqlite+aiosqlite:///./intellearn.db"
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "intellearn_ai"
    REDIS_URI: str = "redis://localhost:6379/0"

    # Upload Specs
    MAX_UPLOAD_SIZE_BYTES: int = 100 * 1024 * 1024  # 100MB
    UPLOAD_DIR: str = "./uploads"

    # AI Model Credentials
    GEMINI_API_KEY: str = "YOUR_GEMINI_API_KEY_HERE"
    GEMINI_MODEL: str = "gemini-3.5-flash"
    OPENAI_API_KEY: str = "sk-mock-openai-key"
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
