# app/api/v1/endpoints/payments.py
from fastapi import APIRouter, Depends,Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.payment_service import PaymentService
from app.schemas.payments import PaymentListRequest
from sqlalchemy import update, select
from app.models.payment import Payment
from app.core.security import require_roles


router = APIRouter()

@router.get("/pay/{order_id}")
async def pay_seller(order_id: int, db: AsyncSession = Depends(get_db)):
    service = PaymentService(db)
    return await service.pay_seller(order_id) 

@router.get("/status/{order_id}")
async def get_payment_status(order_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).where(Payment.order_id == order_id))
    payment = result.scalar_one_or_none()
    return {"status": payment.status if payment else "unpaid"}

@router.get("/connect/status/{stripe_account_id}")
async def update_and_get_status(stripe_account_id: str, db: AsyncSession = Depends(get_db)):
    service = PaymentService(db)
    return await service.get_connected_account_status(stripe_account_id)

@router.post("/list",dependencies=[Depends(require_roles(["admin"]))])
async def get_all_payments(
    filters: PaymentListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    return await PaymentService.get_payments_list(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
    )

@router.get("/{user_id}")
async def get_user_payments_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await PaymentService.get_user_payment_by_id(
        user_id=user_id,
        db=db
    )

