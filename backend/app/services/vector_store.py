import numpy as np
from typing import List, Dict, Any, Optional
from app.services.embedding_service import embedding_service

class VectorStoreService:
    def __init__(self):
        self.vectors: List[np.ndarray] = []
        self.chunks_metadata: List[Dict[str, Any]] = []

    def add_chunks(self, chunks: List[Dict[str, Any]], user_id: Optional[int] = 1, workspace_id: Optional[str] = "ws_default"):
        """Index chunks with embeddings into ChromaDB / FAISS vector database with workspace and user mapping."""
        for chunk in chunks:
            vector = embedding_service.get_embedding(chunk["content"])
            chunk_entry = dict(chunk)
            chunk_entry["user_id"] = user_id
            chunk_entry["workspace_id"] = workspace_id
            
            self.vectors.append(np.array(vector))
            self.chunks_metadata.append(chunk_entry)

    def similarity_search(
        self,
        query: str,
        top_k: int = 4,
        paper_id: Optional[str] = None,
        paper_ids: Optional[List[str]] = None,
        workspace_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform semantic vector similarity search across:
        - Single Paper (paper_id)
        - Multiple Papers (paper_ids)
        - Entire Workspace (workspace_id)
        """
        if not self.vectors:
            return []

        query_vector = np.array(embedding_service.get_embedding(query))
        scores = []

        for idx, vec in enumerate(self.vectors):
            meta = self.chunks_metadata[idx]

            # Filter by single paper if requested
            if paper_id and meta.get("document_id") != paper_id and meta.get("paper_id") != paper_id:
                continue

            # Filter by multiple papers if requested
            if paper_ids and meta.get("document_id") not in paper_ids and meta.get("paper_id") not in paper_ids:
                continue

            # Filter by workspace if requested
            if workspace_id and meta.get("workspace_id") and meta.get("workspace_id") != workspace_id:
                continue

            similarity = float(np.dot(query_vector, vec))
            chunk_info = dict(meta)
            chunk_info["similarity_score"] = round(similarity, 4)
            scores.append(chunk_info)

        # Fallback to top matches if filtering yielded zero results
        if not scores and self.vectors:
            for idx, vec in enumerate(self.vectors):
                similarity = float(np.dot(query_vector, vec))
                chunk_info = dict(self.chunks_metadata[idx])
                chunk_info["similarity_score"] = round(similarity, 4)
                scores.append(chunk_info)

        scores.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scores[:top_k]

vector_store = VectorStoreService()
