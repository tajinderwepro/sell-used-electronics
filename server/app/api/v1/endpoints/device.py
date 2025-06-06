# app/routes/auth_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.device import DeviceListResponse
from app.services.device_service import DeviceService

router = APIRouter()

@router.get("/", response_model=DeviceListResponse)
async def get_list(data : DeviceListResponse, db: AsyncSession = Depends(get_db)):
    return await DeviceService.get_devices(data, db)
