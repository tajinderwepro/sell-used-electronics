from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.models.order import Order
from app.schemas.orders import OrderCreate, OrderUpdate


class OrderService:

    @staticmethod
    async def get_all_orders(db: AsyncSession):
        result = await db.execute(select(Order))
        orders = result.scalars().all()
        return orders


    @staticmethod
    async def get_order(db: AsyncSession, order_id: int):
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return order

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
