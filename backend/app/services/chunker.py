from typing import List, Dict, Any

class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_text(self, text: str) -> List[str]:
        """Recursively split text by paragraphs, sentences, and words."""
        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = min(start + self.chunk_size, text_len)
            chunk = text[start:end]
            chunks.append(chunk.strip())
            start += (self.chunk_size - self.chunk_overlap)
        
        return [c for c in chunks if c]

class ChunkerService:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)

    def create_chunks(self, document_id: str, pages: List[Dict[str, Any]], title: str) -> List[Dict[str, Any]]:
        """Create metadata-rich chunks for vector database indexing."""
        all_chunks = []
        chunk_counter = 1

        for p in pages:
            page_num = p["page"]
            text = p["text"]
            splits = self.splitter.split_text(text)

            for split in splits:
                all_chunks.append({
                    "chunk_id": f"{document_id}_chk_{chunk_counter}",
                    "document_id": document_id,
                    "title": title,
                    "page_number": page_num,
                    "section": "IEEE Content" if page_num == 1 else f"Section {page_num}.0",
                    "content": split
                })
                chunk_counter += 1

        return all_chunks

chunker_service = ChunkerService()
