from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Literal, Optional
from app.services.shipping_service import ShippingService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, select
from app.models.order import Order  
from app.models.quote import Quote  
from app.db.session import get_db

router = APIRouter()

class AddressModel(BaseModel):
    name: Optional[str] = None
    street1: str
    street2: Optional[str] = None
    city: str
    state: str
    zip: str
    country: str = "US"
    phone: str

class AddressValidationRequest(BaseModel):
    provider: Literal["easypost", "shippo"]
    address: AddressModel

@router.post("/validate-address")
def validate_address(request: AddressValidationRequest):
    try:
        service = ShippingService()
        result = service.validate_address(request.address.dict())
        return {"valid": True, "address": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/track")
def track_order(provider: Literal["easypost", "shippo"], tracking_number: str, carrier: Optional[str] = None):
    try:
        service = ShippingService()
        tracking = service.track_order(tracking_number, carrier)
        return {"tracking_status": tracking}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/easypost-webhook")
async def easypost_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        payload = await request.json()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    if payload.get("object") != "Event" or "result" not in payload:
        raise HTTPException(status_code=400, detail="Invalid EasyPost webhook")

    event_type = payload.get("description")
    tracker = payload["result"]
    tracking_number = tracker.get("id")
    tracking_status = tracker.get("status")

    if not tracking_number:
        raise HTTPException(status_code=400, detail="Tracking number not found")

    stmt = select(Order).where(Order.tracking_number == tracking_number)
    result = await db.execute(stmt)
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    quote_stmt = select(Quote).where(Quote.id == order.quote_id)
    quote_result = await db.execute(quote_stmt)
    quote = quote_result.scalar_one_or_none()
    quote.status = tracking_status
    await db.commit()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = tracking_status
    order.tracking_url = tracker.get("public_url", None)
    await db.commit()

    return {"success": True, "message": f"Order {order.id} updated to status '{tracking_status}'"}
