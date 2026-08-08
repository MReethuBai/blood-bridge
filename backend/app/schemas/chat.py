from pydantic import BaseModel
from typing import Optional, List

class SourceCitation(BaseModel):
    document_name: str
    doi: Optional[str] = None
    page: int
    section: str

class ChatRequest(BaseModel):
    message: str
    document_ids: Optional[List[str]] = []
    conversation_id: Optional[str] = "conv-default"
    strict_ieee_mode: bool = True

class ChatResponse(BaseModel):
    message_id: str
    conversation_id: str
    sender: str = "ai"
    answer: str
    code_block: Optional[str] = None
    table_data: Optional[dict] = None
    citations: List[SourceCitation] = []
    timestamp: str
