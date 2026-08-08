from fastapi import APIRouter

router = APIRouter(prefix="/history", tags=["History & Activity Logs"])

@router.get("/downloads")
async def get_download_history():
    """Retrieve history of downloaded research reports, notes, quizzes, and summaries."""
    return [
        {
            "id": 1,
            "title": "IEEE_Transformer_V3_Benchmark_Report.pdf",
            "type": "Research Report",
            "date": "2026-07-30 14:15",
            "size": "4.8 MB"
        },
        {
            "id": 2,
            "title": "Biochemistry_Chapter4_Notes.docx",
            "type": "Generated Notes",
            "date": "2026-07-29 17:40",
            "size": "1.2 MB"
        }
    ]

@router.get("/activity")
async def get_activity_log():
    """Retrieve user recent activity session log."""
    return [
        {"action": "Synthesized IEEE Paper", "target": "Transformer_Architecture_Deep_Dive_v3.pdf", "timestamp": "10 mins ago"},
        {"action": "Completed Quiz Deck", "target": "Enzyme Kinetics Quiz (15/15)", "timestamp": "1 hour ago"}
    ]
