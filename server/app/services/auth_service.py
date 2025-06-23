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
from app.core.config import settings  
from sqlalchemy import and_
from sqlalchemy.orm import selectinload

SECRET_KEY = settings.JWT_SECRET
ACCESS_TOKEN_EXPIRE_HOURS = settings.ACCESS_TOKEN_EXPIRE_HOURS
ALGORITHM = settings.ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        to_encode.update({"exp": expire})  
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    @staticmethod
    async def login_user(data: LoginRequest, db: AsyncSession) -> TokenResponse:
        result = await db.execute(
            select(User).where(
                and_(
                    User.email == data.email,
                    User.role == data.role
                )
            )
        )
        user = result.scalars().first()

        if not user or not AuthService.verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token = AuthService.create_access_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserOut.from_orm(user)  
        )
    @staticmethod
    async def register_user(data: UserCreate, db: AsyncSession) -> RegisterUserResponse:
        try:
            hashed_pw = pwd_context.hash(data.password_hash)
            db_user = User(
                email=data.email,
                name=data.name,
                password_hash=hashed_pw,
                role=data.role,
                phone=data.phone
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

    @staticmethod
    async def get_me(current_user: User, db: AsyncSession):
        result = await db.execute(
            select(User).options(selectinload(User.media)).where(User.id == current_user.id)
        )
        user = result.scalars().first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {"success": True, "user": UserOut.from_orm(user)}

