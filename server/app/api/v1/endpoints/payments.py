from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Literal, Optional
from app.services.payment_service import StripePaymentService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, select
from app.db.session import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/stripe-payment")
def track_order():
    try:
        payment_service = StripePaymentService()
        response = payment_service.create_payment_intent(4999, metadata={"order_id": 123})
        return {"client_secret": response}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
