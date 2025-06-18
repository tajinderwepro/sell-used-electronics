from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserOut, UserUpdate
from app.schemas.orders import OrderCreate
from app.db.session import async_session
# from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from typing import Optional
from sqlalchemy import select, asc, desc, or_, func
from app.utils.db_helpers import paginate_query
from app.models.quote import Quote
from app.models.address import Address
from app.schemas.quote import QuoteOut
from sqlalchemy.orm import selectinload
from app.models.media import Media
from app.utils.file_utils import save_upload_file
from app.services.shipping_service import ShippingService
from app.services.order_service import OrderService

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
    async def get_user_quotes(
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
            model=Quote,
            schema=QuoteOut,
            search=search,
            search_fields=[Quote.category],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=limit,
            options=[
                selectinload(Quote.category),
                selectinload(Quote.brand),
                selectinload(Quote.model),
                selectinload(Quote.user),
                selectinload(Quote.media)
            ],
            user_id=user_id
        )

    @staticmethod
    async def request_shipment(db: AsyncSession, quote_id: int):
        result = await db.execute(select(Quote).where(Quote.id == quote_id))
        quote = result.scalar_one_or_none()
        if not quote:
            return {"message": "Quote not found", "success": False}

        user_result = await db.execute(select(User).where(User.id == quote.user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            return {"message": "User not found", "success": False}

        address_result = await db.execute(
            select(Address).where(Address.user_id == quote.user_id)
        )
        address = address_result.scalar_one_or_none()
        if not address:
            return {"message": "Address not found", "success": False}


        admin_result = await db.execute(select(User).where(User.role == 'admin'))
        admin = admin_result.scalar_one_or_none()
        if not admin:
            return {"message": "Admin not found", "success": False}

        admin_address_result = await db.execute(
            select(Address).where(Address.user_id == admin.id)
        )
        admin_address = admin_address_result.scalar_one_or_none()
        if not admin_address:
            return {"message": "admin Address not found", "success": False}

        to_address = {
            "name": admin.name,
            "street1": admin_address.address,
            "city": admin_address.city,
            "state": admin_address.state,
            "zip": admin_address.zip,
            "country": "US",
            "phone": admin.phone
        }

        from_address = {
            "name": user.name,
            "street1": address.address,
            "city": address.city,
            "state": address.state,
            "zip": address.zip,
            "country": "US",
            "phone": user.phone
        }

        parcel = {
            "length": 10.0,
            "width": 5.0,
            "height": 3.0,
            "weight": 1.5
        }

        provider = 'easypost'
        service = ShippingService()

        try:
            shipment = service.create_shipment(
                from_address=from_address,
                to_address=to_address,
                parcel=parcel
            )
            lowest_rate = service.get_lowest_rate(shipment)
            order = OrderCreate(
                quote_id=quote.id,
                status="pending",
            )
            quote.status = "shipped"
            await db.commit()
            await db.refresh(quote)
            return await OrderService.create_order(db, order)
            # shipment_id = shipment["id"]
            # bought_shipment = service.buy_shipment(shipment_id, insurance=249.99)
            return {
                "shipment": shipment.to_dict() if hasattr(shipment, "to_dict") else shipment,
                "lowest_rate": lowest_rate,
                "success": True
            }
        except Exception as e:
            return {"message": str(e), "success": False}
