from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.rag_engine import rag_engine
from app.db.mongo import mongo_store

router = APIRouter(prefix="/chat", tags=["AI Chat Assistant"])

@router.post("/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    """
    ChatGPT-like AI Research Assistant Endpoint.
    Answers strictly bound to uploaded IEEE documents with vector similarity retrieval & citations.
    """
    response = await rag_engine.generate_rag_response(request)
    
    # Store chat history in MongoDB store
    mongo_store.chat_history.append({
        "request": request.model_dump(),
        "response": response.model_dump()
    })
    
    return response

@router.get("/history")
async def get_chat_history():
    """Retrieve chat history log."""
    return mongo_store.chat_history
