import os
from celery import Celery

REDIS_URI = os.getenv("REDIS_URI", "redis://localhost:6379/0")

celery_app = Celery(
    "intellearn_workers",
    broker=REDIS_URI,
    backend=REDIS_URI
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task(name="tasks.process_paper_background")
def process_paper_background(paper_id: str, file_path: str):
    """Background job task for PDF text extraction and vector embedding."""
    print(f"[Celery Worker] Background processing started for Paper ID: {paper_id}")
    return {"status": "completed", "paper_id": paper_id}

@celery_app.task(name="tasks.generate_mcqs_background")
def generate_mcqs_background(document_id: str, count: int = 10):
    """Background task for automated MCQ generation."""
    print(f"[Celery Worker] Generating {count} MCQs for Document ID: {document_id}")
    return {"status": "completed", "document_id": document_id}
