from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserOut, UserUpdate
from app.db.session import async_session
# from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from typing import Optional
from sqlalchemy import select, asc, desc, or_, func
from app.utils.db_helpers import paginate_query
from app.models.device import Device
from app.schemas.device import DeviceOut
from sqlalchemy.orm import selectinload
from app.models.media import Media
from app.utils.file_utils import save_upload_file
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    @staticmethod
    async def get_all_users(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "name",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10,
        get_all: bool = False
    ):
        return await paginate_query(
            db=db,
            model=User,
            schema=UserOut,
            search=search,
            search_fields=[User.name, User.email],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=None if get_all else limit,  
        )


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
    async def update_user(user_id: int, image_path: str, user_in: UserUpdate, db: AsyncSession):
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            return {"message": "User not found", "success": False}

        update_data = user_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(user, field, value)

        db.add(user)

        if image_path:
            media_result = await db.execute(
                select(Media).where(
                    Media.mediable_id == user.id,
                    Media.mediable_type == 'user'
                )
            )
            media = media_result.scalar_one_or_none()

            if media:
                media.path = image_path
            else:
                media = Media(
                    path=image_path,
                    mediable_type='user',
                    mediable_id=user.id
                )
                db.add(media)

        await db.commit()
        await db.refresh(user)

        return {
            "user": UserOut.from_orm(user),
            "message": "User updated successfully",
            "success": True
        }


    @staticmethod
    async def get_user_devices(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "name",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10,
        user_id: int = None
    ):
        return await paginate_query(
            db=db,
            model=Device,
            schema=DeviceOut,
            search=search,
            search_fields=[Device.category],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=limit,
            options=[
                selectinload(Device.category_rel),
                selectinload(Device.brand_rel),
                selectinload(Device.model_rel),
                selectinload(Device.user),
                selectinload(Device.media)
            ],
            user_id=user_id
        )