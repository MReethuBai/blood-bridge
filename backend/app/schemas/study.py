from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class NotesGenerateRequest(BaseModel):
    document_id: str
    tab_mode: str = "simple"  # simple, detailed, topic, chapter, unit, important

class McqGenerateRequest(BaseModel):
    document_id: str
    difficulty: str = "Medium"  # Easy, Medium, Hard
    question_count: int = 10
    types: List[str] = ["MCQ", "True False", "Fill Blank"]

class Flashcard(BaseModel):
    id: int
    question: str
    answer: str
    topic: str

class MCQItem(BaseModel):
    id: int
    type: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str
