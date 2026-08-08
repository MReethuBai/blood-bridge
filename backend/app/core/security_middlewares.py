import time
import logging
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("intellearn.security")

# Simple In-Memory Rate Limiter (100 requests / minute per client IP)
RATE_LIMIT_STORE = {}
MAX_REQUESTS_PER_MINUTE = 100

class ProductionSecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        current_time = time.time()

        # Rate Limiting Check
        if client_ip not in RATE_LIMIT_STORE:
            RATE_LIMIT_STORE[client_ip] = []

        # Remove requests older than 60 seconds
        RATE_LIMIT_STORE[client_ip] = [t for t in RATE_LIMIT_STORE[client_ip] if current_time - t < 60]

        if len(RATE_LIMIT_STORE[client_ip]) >= MAX_REQUESTS_PER_MINUTE:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Maximum 100 requests allowed per minute."
            )

        RATE_LIMIT_STORE[client_ip].append(current_time)

        # Process Request
        start_time = time.time()
        response = await call_next(request)
        process_time = round((time.time() - start_time) * 1000, 2)

        # Security Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Server-Timing"] = f"total;dur={process_time}"

        return response

def validate_uploaded_file(filename: str, file_size: int):
    """Validate uploaded file type and maximum size threshold."""
    allowed_extensions = {".pdf", ".docx", ".pptx", ".txt", ".zip", ".png", ".jpg"}
    ext = filename.lower()[filename.rfind("."):].strip() if "." in filename else ""
    
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security Alert: File type '{ext}' is not permitted. Allowed: {', '.join(allowed_extensions)}"
        )

    if file_size > 100 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security Alert: Uploaded file size exceeds maximum 100MB threshold."
        )
