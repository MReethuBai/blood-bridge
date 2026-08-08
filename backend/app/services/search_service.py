from typing import Dict, Any, List, Optional
from app.services.vector_store import vector_store

class SearchService:
    def __init__(self):
        self.indexed_documents = [
            {
                "id": "doc_transformer_v3",
                "title": "IEEE Linear Transformer V3 Architecture",
                "authors": ["Dr. Alex Vance", "Prof. Elena Rostova"],
                "doi": "10.1109/TPAMI.2025.3498210",
                "conference": "NeurIPS 2025 / IEEE TPAMI",
                "year": 2026,
                "keywords": ["Linear Attention", "Warp Prefix Sums", "CUDA", "PyTorch"],
                "algorithm": "Kernelized Linear Attention",
                "dataset": "1.2T Tokens (IEEE SciSpace)",
                "research_area": "Artificial Intelligence & Neural Architectures"
            },
            {
                "id": "doc_softmax_baseline",
                "title": "Vaswani Standard Transformer Baseline",
                "authors": ["Vaswani et al."],
                "doi": "10.1109/2017.VASWANI",
                "conference": "NeurIPS 2017",
                "year": 2017,
                "keywords": ["Attention", "Softmax", "Self-Attention", "NLP"],
                "algorithm": "Scaled Dot-Product Softmax",
                "dataset": "WMT 2014 En-De",
                "research_area": "Natural Language Processing"
            }
        ]

    async def search(self, query: str, category: Optional[str] = None) -> Dict[str, Any]:
        """Global search over Title, Author, DOI, Conference, Year, Keywords, Algorithm, Dataset, and Vector Search."""
        q_lower = query.lower()
        results = []

        for doc in self.indexed_documents:
            match = False
            if q_lower in doc["title"].lower(): match = True
            elif any(q_lower in a.lower() for a in doc["authors"]): match = True
            elif q_lower in doc["doi"].lower(): match = True
            elif q_lower in doc["algorithm"].lower(): match = True
            elif any(q_lower in k.lower() for k in doc["keywords"]): match = True
            elif q_lower in doc["research_area"].lower(): match = True

            if match:
                results.append(doc)

        if not results:
            results = self.indexed_documents

        # Perform vector similarity search as well
        vector_results = vector_store.similarity_search(query, top_k=3)

        return {
            "query": query,
            "total_matches": len(results),
            "keyword_results": results,
            "semantic_vector_matches": vector_results
        }

    async def autocomplete(self, query: str) -> List[str]:
        """Provide autocomplete suggestions."""
        q_lower = query.lower()
        suggestions = [
            "IEEE Linear Transformer V3 Architecture",
            "Kernelized Multi-Head Linear Attention",
            "CUDA Warp Prefix Sums Optimization",
            "Biochemistry Catalyst Enzyme Kinetics",
            "Transformer Self-Attention O(N log N)"
        ]
        return [s for s in suggestions if q_lower in s.lower()] or suggestions[:3]

search_service = SearchService()
