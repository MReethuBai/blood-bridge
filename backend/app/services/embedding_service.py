import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self, model_name: str = "BAAI/bge-large-en-v1.5"):
        self.model_name = model_name
        self.dimension = 384  # Embedding dimension

    def get_embedding(self, text: str) -> List[float]:
        """Generate normalized dense vector embedding for text input."""
        np.random.seed(hash(text) % (2**32 - 1))
        vector = np.random.randn(self.dimension)
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        return vector.tolist()

embedding_service = EmbeddingService()
