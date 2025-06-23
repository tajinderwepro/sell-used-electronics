# app/routes/auth_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse,PasswordResetResponse,PasswordReset
from app.schemas.user import UserCreate, UserResponse,RegisterUserResponse
from app.services.auth_service import AuthService
from app.core.security import get_current_user
from app.models.user import User

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
async def me(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await AuthService.get_me(user, db)

# reset password
@router.post("/reset-password/{user_id}", response_model=PasswordResetResponse)
async def reset_password(user_id: int,data:PasswordReset, db: AsyncSession = Depends(get_db)):
    return await AuthService.reset_password(user_id,data, db)  


@router.post("/logout")
def logout():
    return {"message": "Logout successful. Please discard your token."}
