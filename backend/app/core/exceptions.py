from fastapi import HTTPException, status

class IntelLearnException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ValidationException(IntelLearnException):
    def __init__(self, detail: str = "Invalid request payload or file format."):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class AuthenticationException(IntelLearnException):
    def __init__(self, detail: str = "Could not validate credentials."):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

class PermissionException(IntelLearnException):
    def __init__(self, detail: str = "Insufficient permissions to perform this action."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class UploadException(IntelLearnException):
    def __init__(self, detail: str = "File upload or virus scan validation failed."):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

class LLMException(IntelLearnException):
    def __init__(self, detail: str = "AI inference engine error."):
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail)
