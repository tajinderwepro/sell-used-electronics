# app/services/user_service.py

from app.models.user import User
from app.schemas.user import UserCreate, UserResponse,UserOut
from app.db.session import async_session
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    @staticmethod
    async def get_all_users():
        async with async_session() as session:
            result = await session.execute(select(User))
            users = result.scalars().all()
            return {
                "users": [UserOut.from_orm(user) for user in users],
                "message": "Users fetched successfully",
                "success": True
            }

    @staticmethod
    async def get_user_by_id(user_id: int):
        async with async_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                return UserResponse.from_orm(user)
            return None

    @staticmethod
    async def delete_user(user_id: int):
        async with async_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                await session.delete(user)
                await session.commit()
                return {"message": "User deleted", "success": True}
            return {"message": "User not found", "success": False}
