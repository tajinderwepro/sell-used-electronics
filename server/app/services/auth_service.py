# app/services/auth_service.py

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate,RegisterUserResponse,UserResponse,UserOut
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def login_user(data: LoginRequest, db: AsyncSession) -> TokenResponse:
        result = await db.execute(select(User).where(User.email == data.email))
        user = result.scalars().first()

        if not user or not AuthService.verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token = AuthService.create_access_token(data={"sub": str(user.id)})
        return TokenResponse(access_token=access_token, token_type="bearer",user=user)

    @staticmethod
    async def register_user(data: UserCreate, db: AsyncSession) -> RegisterUserResponse:
        try:
            hashed_pw = pwd_context.hash(data.password_hash)
           
            db_user = User(
                email=data.email,
                name=data.name,
                password_hash=hashed_pw,
                role=data.role
            )
            db.add(db_user)
            await db.commit()
            await db.refresh(db_user)

            return RegisterUserResponse(
            user=UserOut.from_orm(db_user),
            message="User registered successfully",
            success=True
        )

        except SQLAlchemyError as e:
            await db.rollback()
            return RegisterUserResponse(
                user=None,
                message="Failed to register user",
                success=False,
                error=str(e)
            )