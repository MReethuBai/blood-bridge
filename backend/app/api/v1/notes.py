from fastapi import APIRouter, Query, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from app.services.notes_service import notes_service

router = APIRouter(prefix="/notes", tags=["Notes & Annotations Engine"])

class NoteCreateRequest(BaseModel):
    title: str
    content: str
    folder: Optional[str] = "General Notes"
    paper_id: Optional[str] = "doc_transformer_v3"

class NoteUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    folder: Optional[str] = None

class StickyNoteCreateRequest(BaseModel):
    content: str
    color: Optional[str] = "yellow"

@router.get("/")
async def get_notes(folder: Optional[str] = Query(None, description="Filter by folder name")):
    """Retrieve all study notes with optional folder filtering."""
    return await notes_service.get_all_notes(folder=folder)

@router.post("/")
async def create_note(payload: NoteCreateRequest):
    """Create a new note with auto-save."""
    return await notes_service.create_note(payload.title, payload.content, payload.folder, payload.paper_id)

@router.put("/{note_id}")
async def update_note(note_id: str, payload: NoteUpdateRequest):
    """Update note title, content, or folder."""
    return await notes_service.update_note(note_id, payload.title, payload.content, payload.folder)

@router.delete("/{note_id}")
async def delete_note(note_id: str):
    """Delete a note."""
    success = await notes_service.delete_note(note_id)
    return {"message": f"Note '{note_id}' deleted.", "success": success}

@router.get("/sticky")
async def get_sticky_notes():
    """Retrieve sticky notes."""
    return await notes_service.get_sticky_notes()

@router.post("/sticky")
async def create_sticky_note(payload: StickyNoteCreateRequest):
    """Create a sticky note."""
    return await notes_service.create_sticky_note(payload.content, payload.color)
