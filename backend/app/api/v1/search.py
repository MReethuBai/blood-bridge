from fastapi import APIRouter, Query
from app.services.search_service import search_service

router = APIRouter(prefix="/search", tags=["Global Unified Search"])

@router.get("/")
@router.get("/query")
async def global_search(q: str = Query("Transformer", description="Search query")):
    """Global search across Title, Author, DOI, Conference, Year, Keyword, Algorithm, Dataset, and Vector Search."""
    return await search_service.search(q)

@router.get("/autocomplete")
async def autocomplete(q: str = Query("Trans", description="Query prefix")):
    """Autocomplete suggestions for search bar."""
    return await search_service.autocomplete(q)
