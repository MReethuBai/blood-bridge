from typing import Optional

class RedisCacheService:
    def __init__(self):
        self._cache = {}

    async def get(self, key: str) -> Optional[str]:
        return self._cache.get(key)

    async def set(self, key: str, value: str, ttl: int = 3600):
        self._cache[key] = value

    async def delete(self, key: str):
        self._cache.pop(key, None)

redis_client = RedisCacheService()
