import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request, jsonify
from app.database import get_collection

JWT_SECRET = os.getenv("JWT_SECRET", "bloodbridge_super_secret_jwt_key_2026")
JWT_ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return check_password_hash(hashed, password)

def create_access_token(user_id: str, email: str, role: str, name: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "name": name,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization header missing or invalid format"}), 401
        
        token = auth_header.split(" ")[1]
        decoded = decode_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        request.current_user = decoded
        return f(*args, **kwargs)
    return decorated

def roles_required(roles):
    def decorator(f):
        @wraps(f)
        @jwt_required
        def decorated(*args, **kwargs):
            user_role = getattr(request, "current_user", {}).get("role")
            if user_role not in roles:
                return jsonify({"error": f"Access denied. Requires one of roles: {roles}"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
