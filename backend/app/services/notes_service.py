from typing import Dict, Any, List, Optional

class NotesService:
    def __init__(self):
        self.notes: List[Dict[str, Any]] = [
            {
                "id": "note_1",
                "user_id": 1,
                "paper_id": "doc_transformer_v3",
                "folder": "IEEE Architectures",
                "title": "Kernelized Linear Attention Notes",
                "content": "Substrate linear attention decomposition reduces computational complexity from O(N^2) to O(N log N) using GPU warp prefix sum scans.",
                "mode": "detailed",
                "is_bookmarked": True,
                "created_at": "2026-07-31"
            },
            {
                "id": "note_2",
                "user_id": 1,
                "paper_id": "doc_transformer_v3",
                "folder": "General Notes",
                "title": "CUDA Warp Shuffle Optimization",
                "content": "Utilizes __shfl_sync registers to avoid SRAM memory bandwidth bottlenecks on NVIDIA A100 GPUs.",
                "mode": "important",
                "is_bookmarked": False,
                "created_at": "2026-07-30"
            }
        ]

        self.sticky_notes: List[Dict[str, Any]] = [
            {
                "id": "sticky_1",
                "content": "Review Figure 4 warp prefix scan diagram before thesis submission.",
                "color": "yellow",
                "position_x": 120,
                "position_y": 80
            }
        ]

    async def get_all_notes(self, user_id: int = 1, folder: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve notes with optional folder filtering."""
        if folder:
            return [n for n in self.notes if n.get("folder") == folder]
        return self.notes

    async def create_note(self, title: str, content: str, folder: str = "General Notes", paper_id: Optional[str] = None) -> Dict[str, Any]:
        """Create a new note with auto-save support."""
        new_note = {
            "id": f"note_{len(self.notes) + 1}",
            "user_id": 1,
            "paper_id": paper_id or "doc_transformer_v3",
            "folder": folder,
            "title": title,
            "content": content,
            "mode": "detailed",
            "is_bookmarked": False,
            "created_at": "2026-07-31"
        }
        self.notes.insert(0, new_note)
        return new_note

    async def update_note(self, note_id: str, title: Optional[str] = None, content: Optional[str] = None, folder: Optional[str] = None) -> Dict[str, Any]:
        """Update an existing note."""
        for n in self.notes:
            if n["id"] == note_id:
                if title: n["title"] = title
                if content: n["content"] = content
                if folder: n["folder"] = folder
                return n
        return self.notes[0]

    async def delete_note(self, note_id: str) -> bool:
        """Delete a note."""
        self.notes = [n for n in self.notes if n["id"] != note_id]
        return True

    async def get_sticky_notes(self) -> List[Dict[str, Any]]:
        """Retrieve sticky notes."""
        return self.sticky_notes

    async def create_sticky_note(self, content: str, color: str = "yellow") -> Dict[str, Any]:
        """Create a sticky note."""
        st = {
            "id": f"sticky_{len(self.sticky_notes) + 1}",
            "content": content,
            "color": color,
            "position_x": 100 + len(self.sticky_notes) * 20,
            "position_y": 100
        }
        self.sticky_notes.append(st)
        return st

notes_service = NotesService()
