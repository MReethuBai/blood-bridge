from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.models import User
from app.middlewares.auth import get_current_user
from app.services.dashboard_service import DashboardService

router = APIRouter(tags=["Dashboard"])

@router.get("/dashboard")
async def get_dashboard(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve aggregated live metrics for dashboard cards, recent papers, and workspaces."""
    service = DashboardService(db)
    return await service.get_dashboard_metrics(user)
