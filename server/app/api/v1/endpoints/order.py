from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.orders import OrderCreate, OrderOut, OrderUpdate,OrderListResponse
from app.services.order_service import OrderService

router = APIRouter()

@router.get("/list", response_model=OrderListResponse)
async def list_orders(db: AsyncSession = Depends(get_db)):
    orders = await OrderService.get_all_orders(db)
    return OrderListResponse(
        data=[OrderOut.from_orm(order) for order in orders],
        message="All orders fetched successfully",
        success=True
    )

@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: int, db: AsyncSession = Depends(get_db)):
    return await OrderService.get_order(db, order_id)

@router.post("/", response_model=OrderOut)
async def create_order(order: OrderCreate, db: AsyncSession = Depends(get_db)):
    return await OrderService.create_order(db, order)

@router.put("/{order_id}", response_model=OrderOut)
async def update_order(order_id: int, order: OrderUpdate, db: AsyncSession = Depends(get_db)):
    return await OrderService.update_order(db, order_id, order)

@router.delete("/{order_id}")
async def delete_order(order_id: int, db: AsyncSession = Depends(get_db)):
    return await OrderService.delete_order(db, order_id)
