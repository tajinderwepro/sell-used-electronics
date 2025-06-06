# app/routes/auth_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.login_user(data, db)

@router.post("/register", response_model=UserCreate)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await AuthService.register_user(data, db)

@router.post("/logout")
def logout():
    return {"message": "Logout successful. Please discard your token."}
