# app/routes/auth_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse,RegisterUserResponse
from app.services.auth_service import AuthService
from app.core.security import get_current_user_id

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.login_user(data, db)

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService.login_user(data, db, role_check="admin")

@router.post("/register", response_model=RegisterUserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await AuthService.register_user(data, db)

@router.get("/me")
async def me(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.get_me(user_id, db) 
@router.post("/logout")
def logout():
    return {"message": "Logout successful. Please discard your token."}
