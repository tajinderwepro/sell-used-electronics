from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.orders import OrderCreate, OrderOut, OrderUpdate,OrderListResponse, OrderListRequest
from app.services.order_service import OrderService
# from fastapi import APIRouter,Depends, HTTPException, status, Query, Body, Form, UploadFile, File

router = APIRouter()

@router.post("/list", response_model=OrderListResponse)
async def list_orders(db: AsyncSession = Depends(get_db),filters: OrderListRequest = Body(...)):
    return await OrderService.get_all_orders(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
    )
    # return OrderListResponse(
    #     data=[OrderOut.from_orm(order) for order in orders],
    #     message="All orders fetched successfully",
    #     success=True
    # )

@router.get("/latest-order")
async def get_latest(
    db: AsyncSession = Depends(get_db)
):
        return await OrderService.get_latest_order(
            db=db,
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
