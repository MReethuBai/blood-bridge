import logging
from typing import Dict, Any, List

logger = logging.getLogger("intellearn.mongo")

# In-memory document & chat store fallback for MongoDB
class MongoFallbackStore:
    def __init__(self):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunks: List[Dict[str, Any]] = []
        self.chat_history: List[Dict[str, Any]] = []
        self.research_analysis: Dict[str, Any] = {}
        self.study_notes: Dict[str, Any] = {}
        self.mcqs: Dict[str, Any] = {}

mongo_store = MongoFallbackStore()

async def get_mongo_db():
    """Returns MongoDB database handle or fallback in-memory store."""
    return mongo_store
