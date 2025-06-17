# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, Query, HTTPException, status, Request, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.device import DeviceListResponse, DeviceOut, DeviceCreate,DeviceUpdate,DeviceStatusUpdate, DeviceResponse, DeviceSingleResponse, DeviceApprove, DeviceListRequest
from app.services.device_service import DeviceService
from app.services.ebay_service import EbayService
router = APIRouter()

@router.post("/list", response_model=DeviceListResponse)
async def get_list(
    filters: DeviceListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
        return await DeviceService.get_all_devices(
            db=db,
            search=filters.search,
            sort_by=filters.sort_by,
            order_by=filters.order_by,
            current_page=filters.current_page,
            limit=filters.limit
    )

@router.post("/all-list", response_model=DeviceListResponse)
async def get_list(
    filters: DeviceListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
        return await DeviceService.get_all_devices(
            db=db,
            search=filters.search,
            sort_by=filters.sort_by,
            order_by=filters.order_by,
            current_page=filters.current_page,
            limit=filters.limit,
            get_all=True
    )

@router.post("/submit/{id}", response_model=DeviceListResponse)
async def create_device(id: int, device_in: DeviceCreate, db: AsyncSession = Depends(get_db)):
    return await DeviceService.create_device(id, device_in, db)

@router.delete("/{device_id}", status_code=status.HTTP_200_OK)
async def delete_device(device_id: int, db: AsyncSession = Depends(get_db)):
    success = await DeviceService.delete_device(device_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Device not found")
    return {"message": "Device deleted successfully", "success": True}

@router.get("/{device_id}", response_model=DeviceSingleResponse)
async def get_device(device_id: int, db: AsyncSession = Depends(get_db)):
    response = await DeviceService.get_device_by_id(device_id, db)
    if not response:
        raise HTTPException(status_code=404, detail="Device not found")
    return response

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

@router.put("/status/{device_id}", response_model=DeviceApprove)
async def update_device_status(
    device_id: int,
    status_in: DeviceStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    updated_device = await DeviceService.update_status(device_id,status_in.user_id, status_in.status, db)
    if not updated_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return updated_device

    