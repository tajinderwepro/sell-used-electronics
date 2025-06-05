from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.db.session import async_session
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    async def create_user(user_create: UserCreate) -> UserResponse:
        async with async_session() as session:  # type: AsyncSession
            hashed_pw = pwd_context.hash(user_create.password)
            db_user = User(
                email=user_create.email,
                full_name=user_create.full_name,
                hashed_password=hashed_pw
            )
            session.add(db_user)
            await session.commit()
            await session.refresh(db_user)
            return UserResponse.from_orm(db_user)

    @staticmethod
    async def get_all_users():
        async with async_session() as session:  # type: AsyncSession
            result = await session.execute(select(User))
            users = result.scalars().all()
            return {
                "users": [UserResponse.from_orm(user) for user in users],
                "message": "Users fetched successfully",
                "success": True
            }

    @staticmethod
    async def get_user_by_id(user_id: int):
        async with async_session() as session:  # type: AsyncSession
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                return UserResponse.from_orm(user)
            return None

    @staticmethod
    async def delete_user(user_id: int):
        async with async_session() as session:  # type: AsyncSession
            result = await session.execute(select(User).where(User.id == user_id))
            user = result.scalars().first()
            if user:
                await session.delete(user)
                await session.commit()
                return {"message": "User deleted", "success": True}
            return {"message": "User not found", "success": False}
