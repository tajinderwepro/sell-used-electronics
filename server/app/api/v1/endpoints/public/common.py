
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException,Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.category import CategoryOut,ModelListRequest
from app.services.category_service import CategoryService
from typing import List
from app.core.config import settings  
from app.schemas.category import CategoryUpdate 
from app.schemas.category import ListResponse
from app.core.security import require_roles
from app.schemas.device import DeviceListResponse, DeviceCreate
from app.services.device_service import DeviceService
from app.core.security import require_roles


router = APIRouter()

@router.post("/category/list", response_model=ListResponse[CategoryOut])
async def get_categories(
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.get_all_categories(
        limit=request.limit,
        offset=request.offset,
        db=db
    )

@router.post("/devices/submit/{id}", response_model=DeviceListResponse, dependencies=[Depends(require_roles(["admin","user"]))])
async def create_device(id: int, device_in: DeviceCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.create_device(id, device_in, db)

@router.post("/estimate-price")
async def estimate_price(request: Request):
    # CLIENT_ID = "YOUR_CLIENT_ID"
    # CLIENT_SECRET = "YOUR_CLIENT_SECRET"

    # ebayService = EbayService(CLIENT_ID, CLIENT_SECRET)
    # estimated_price = ebayService.get_estimated_price("iPhone 13 Pro Max")
    data = await request.json()
    base_price = data.get("base_price")
    
    if base_price is None:
        return {"error": "base_price is required"}
    
    estimated_price = base_price - ((base_price * 10) / 100)
    return {"estimated_price": estimated_price}



