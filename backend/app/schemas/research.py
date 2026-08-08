from pydantic import BaseModel
from typing import List, Dict, Any

class IeeeAnalysisResponse(BaseModel):
    document_id: str
    doi_status: str = "Verified IEEE DOI"
    research_score: int = 98
    completeness_score: int = 100
    section_breakdown: List[Dict[str, Any]]
    citation_graph: Dict[str, Any]

class ComparisonMatrixRequest(BaseModel):
    document_ids: List[str]

class ComparisonMatrixResponse(BaseModel):
    matrix_id: str
    compared_papers: List[Dict[str, Any]]
