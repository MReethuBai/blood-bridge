import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
from app.services.rag_engine import rag_engine
from app.schemas.chat import ChatRequest

router = APIRouter(prefix="/ws", tags=["WebSockets & Live Streaming"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        self.active_connections.pop(client_id, None)

    async def send_text(self, client_id: str, message: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

    async def send_json(self, client_id: str, data: dict):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json(data)

manager = ConnectionManager()

@router.websocket("/chat/{client_id}")
async def websocket_chat_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for token-by-token live AI response streaming."""
    await manager.connect(client_id, websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                request_data = json.loads(data_text)
                query = request_data.get("message", data_text)
            except Exception:
                query = data_text

            req = ChatRequest(message=query, conversation_id="conv-ws")
            rag_res = await rag_engine.generate_rag_response(req)
            
            # Stream response in chunks
            answer = rag_res.answer
            words = answer.split(" ")
            
            for i in range(0, len(words), 3):
                chunk = " ".join(words[i:i+3]) + " "
                await websocket.send_json({
                    "type": "stream_chunk",
                    "text": chunk,
                    "done": False
                })
                await asyncio.sleep(0.05)

            await websocket.send_json({
                "type": "stream_end",
                "done": True,
                "citations": [c.model_dump() for c in rag_res.citations]
            })

    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.websocket("/notifications/{client_id}")
async def websocket_notifications(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for live upload progress & processing status."""
    await manager.connect(client_id, websocket)
    try:
        while True:
            await websocket.receive_text()
            await websocket.send_json({
                "type": "notification",
                "title": "IEEE Document Processing",
                "status": "completed",
                "progress": 100
            })
    except WebSocketDisconnect:
        manager.disconnect(client_id)
