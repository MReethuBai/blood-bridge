from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.services.quiz_service import quiz_service

router = APIRouter(tags=["Quiz & Study Engine"])

class QuizSubmitRequest(BaseModel):
    score: int
    total: int
    time_spent: int = 180

@router.get("/mcqs")
async def generate_mcqs(
    document_id: str = Query("doc_transformer_v3"),
    difficulty: str = Query("Medium"),
    count: int = Query(10)
):
    """Generate practice MCQs (10, 20, 50, 100 questions, Easy/Medium/Hard)."""
    return await quiz_service.generate_mcqs(document_id, difficulty, count)

@router.get("/flashcards")
async def generate_flashcards(document_id: str = Query("doc_transformer_v3")):
    """Generate 3D flashcard decks."""
    return await quiz_service.generate_flashcards(document_id)

@router.post("/quiz/submit")
async def submit_quiz(payload: QuizSubmitRequest):
    """Process interactive quiz submission."""
    return await quiz_service.submit_quiz(payload.score, payload.total, payload.time_spent)
