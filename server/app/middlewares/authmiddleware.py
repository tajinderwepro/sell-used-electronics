# middleware/auth.py
from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"

async def authenticate_user(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    open_paths = ["/auth/login", "/auth/logout", "/docs", "/openapi.json", "/redoc"]

    if request.url.path in open_paths:
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        request.state.user = payload.get("sub")  # optional
    except JWTError:
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})

    return await call_next(request)
