from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserOut, UserUpdate
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
                return {
                    "user": UserOut.from_orm(user),
                    "message": "User fetched successfully",
                    "success": True
                }
            return {"message": "User not found", "success": False}

    @staticmethod
    async def delete_user(user_id: int):
        async with async_session() as session:
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                await session.delete(user)
                await session.commit()
                return {"message": "User deleted successfully", "success": True}
            return {"message": "User not found", "success": False}

    @staticmethod
    async def update_user(user_id: int, user_in: UserUpdate, db: AsyncSession):
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            return {"message": "User not found", "success": False}

        update_data = user_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return {
            "user": UserOut.from_orm(user),
            "message": "User updated successfully",
            "success": True
        }
