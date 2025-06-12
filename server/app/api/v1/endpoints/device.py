# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, Query, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.device import DeviceListResponse, DeviceOut, DeviceCreate,DeviceUpdate,CategoryCreate,BrandCreate,ModelCreate,DeviceStatusUpdate
from app.services.device_service import DeviceService
from app.services.ebay_service import EbayService
router = APIRouter()

@router.get("/list", response_model=DeviceListResponse)
async def get_list(db: AsyncSession = Depends(get_db)):
    devices = await DeviceService.get_all_devices(db)
    return DeviceListResponse(
        data=devices,
        message="All devices fetched successfully",
        success=True
    )

@router.post("/submit/{id}", response_model=DeviceListResponse)
async def create_device(id: int, device_in: DeviceCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.create_device(id, device_in, db)

@router.post("/add-category")
async def add_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.add_category(payload.category, db)

@router.post("/add-brand")
async def add_brand(payload: BrandCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.add_brand(payload.category, payload.brand, db)

@router.post("/add-model")
async def add_model(payload: ModelCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.add_model(payload.category, payload.brand, payload.model, db)

@router.get("/category")
async def get_categories(db: AsyncSession = Depends(get_db)):
    data = await DeviceService.get_all_categories(db)
    return {"data": data, "success": True, "message": "Categories fetched"}

@router.get("/brand")
async def get_brands(db: AsyncSession = Depends(get_db)):
    data = await DeviceService.get_all_brands(db)
    return {"data": data, "success": True, "message": "Brands fetched"}

@router.get("/model")
async def get_models(db: AsyncSession = Depends(get_db)):
    data = await DeviceService.get_all_models(db)
    return {"data": data, "success": True, "message": "Models fetched"}


@router.delete("/{device_id}", status_code=status.HTTP_200_OK)
async def delete_device(device_id: int, db: AsyncSession = Depends(get_db)):
    success = await DeviceService.delete_device(device_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"message": "Device deleted successfully", "success": True}

@router.get("/{device_id}", response_model=DeviceOut)
async def get_device(device_id: int, db: AsyncSession = Depends(get_db)):
    device = await DeviceService.get_device_by_id(device_id, db)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.put("/{device_id}", response_model=DeviceOut)
async def update_device(
    device_id: int,
    device_in: DeviceUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated_device = await DeviceService.update_device(device_id, device_in, db)
    if not updated_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated_device
    
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

@router.put("/status/{device_id}", response_model=DeviceOut)
async def update_device_status(
    device_id: int,
    status_in: DeviceStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated_device = await DeviceService.update_status(device_id,status_in.user_id, status_in.status, db)
    if not updated_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated_device