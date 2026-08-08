from fastapi import APIRouter
from app.schemas.study import NotesGenerateRequest, McqGenerateRequest
from app.services.study_service import study_service

router = APIRouter(prefix="/study", tags=["Study Tools Generator"])

@router.post("/notes")
async def generate_notes(payload: NotesGenerateRequest):
    """Generate automatic notes for simple, detailed, topic, chapter, unit, and important modes."""
    return await study_service.generate_notes(payload.document_id, payload.tab_mode)

@router.post("/mcqs")
async def generate_mcqs(payload: McqGenerateRequest):
    """Generate practice MCQs, True/False, Fill in Blank, Assertion Reason, and Numerical questions."""
    return await study_service.generate_mcqs(
        payload.document_id,
        payload.difficulty,
        payload.question_count,
        payload.types
    )

@router.get("/flashcards")
async def get_flashcards(document_id: str = "doc_biochem"):
    """Get 3D flashcards deck."""
    return await study_service.get_flashcards(document_id)
