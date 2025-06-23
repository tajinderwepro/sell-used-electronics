from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.order import Order
from app.models.quote import Quote
from app.models.user import User
from app.schemas.orders import OrderCreate, OrderUpdate, OrderOut
from sqlalchemy import desc
from sqlalchemy.orm import selectinload
from app.utils.db_helpers import paginate_query
from typing import Optional

class OrderService:

    # @staticmethod
    # async def get_all_orders(db: AsyncSession):
    #     result = await db.execute(select(Order).options(selectinload(Order.quote)))
    #     orders = result.scalars().all()

    #     return orders
    @staticmethod
    async def get_all_orders(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "id",  # default should be an actual field
        order_by: str = "asc",
        current_page: int = 1,
        limit: Optional[int] = 10,
        get_all: bool = False,
        user_id: Optional[int] = None,
    ):
        return await paginate_query(      
            db=db,
            model=Order,
            schema=OrderOut,
            search=search,
            search_fields=[Order.tracking_number, Order.status],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=None if get_all else limit,
            join_models=[User],  
            custom_sort_map={"user_name": User.name},
            options=[
                selectinload(Order.quote),
                selectinload(Order.quote).selectinload(Quote.media),
                selectinload(Order.quote).selectinload(Quote.user),
                selectinload(Order.payment)
            ],
            user_id=user_id,
        )

    @staticmethod
    async def get_order(db: AsyncSession, order_id: int):
        result = await db.execute(
            select(Order)
            .options(
                selectinload(Order.quote)
                    .selectinload(Quote.media),
                selectinload(Order.quote)
                    .selectinload(Quote.user),
                selectinload(Order.payment)
            )
            .where(Order.id == order_id)
        )        
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return {"data": OrderOut.from_orm(order), "message": "Order fetched successfully", "success": True}

    @staticmethod
    async def get_latest_order(db: AsyncSession):
        result = await db.execute(
            select(Order)
            .order_by(desc(Order.created_at))
            .limit(1)
        )
        order = result.scalar_one_or_none()
        if not order:
            return None
        return {
            "success": True,
            "message": "Order fetched successfully",
            "data":order,
        }


    @staticmethod
    async def create_order(db: AsyncSession, order_data: OrderCreate):
        new_order = Order(**order_data.dict())
        db.add(new_order)
        await db.commit()
        await db.refresh(new_order)
        return new_order

    @staticmethod
    async def update_order(db: AsyncSession, order_id: int, order_data: OrderUpdate):
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        for field, value in order_data.dict(exclude_unset=True).items():
            setattr(order, field, value)

        await db.commit()
        await db.refresh(order)
        return order

    @staticmethod
    async def delete_order(db: AsyncSession, order_id: int):
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        await db.delete(order)
        await db.commit()
        return {"detail": "Order deleted successfully"}
