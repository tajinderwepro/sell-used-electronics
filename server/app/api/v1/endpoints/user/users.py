from fastapi import APIRouter,Depends, HTTPException, status, Query, Body, Form, UploadFile, File,Request
from typing import List
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, UserResponse,UserListResponse,UserUpdate, UserListRequest
from app.schemas.device import DeviceListRequest
from app.services.user_service import UserService
from app.services.shipping_service import ShippingService
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import uuid4
import os
from app.schemas.device import DeviceListResponse
from app.utils.file_utils import save_upload_file
from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User
from app.services.order_service import OrderService
from app.services.payment_service import PaymentService
router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    return await UserService.create_user(user)

@router.post("/list", response_model=UserListResponse)
async def list_users(
    filters: UserListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    return await UserService.get_all_users(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
    )

@router.post("/all-list", response_model=UserListResponse)
async def list_users(
    filters: UserListRequest = Body(...),
    db: AsyncSession = Depends(get_db)
):
    return await UserService.get_all_users(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
        get_all=True
    )

@router.get("/{user_id}")
async def get_user(user_id: int,db: AsyncSession = Depends(get_db)):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
async def delete(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await UserService.delete_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}")
async def update_user(
    user_id: int,
    name: str = Form(...),
    email: str = Form(...),
    phone: int = Form(...),
    image_path: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    image_full_path = None
    if image_path:
        saved_path = save_upload_file(image_path)  # 🟢 FIXED: add await
        image_full_path = f"{settings.APP_URL}{saved_path}"

    user_data = UserUpdate(name=name, email=email, phone=phone)
    return await UserService.update_user(user_id, image_full_path, user_data, db)


# @router.post("/devices/{user_id}")
# async def get_user(user_id: int,db: AsyncSession = Depends(get_db)):
#     devices = await UserService.get_user_devices(user_id,db)
#     if not devices:
#         raise HTTPException(status_code=404, detail="Devices not found")
#     return devices

@router.post("/quotes/{user_id}")
async def get_user_quotes(
    user_id: int, 
    filters: DeviceListRequest = Body(...),
    db: AsyncSession = Depends(get_db),
):
    return await UserService.get_user_quotes(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
        user_id=user_id,
    )

@router.post("/orders/{user_id}")
async def get_user_orders(
    user_id: int, 
    filters: DeviceListRequest = Body(...),
    db: AsyncSession = Depends(get_db),
):
    return await OrderService.get_all_orders(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
        user_id=user_id
    )

@router.post("/quotes/request-shipment/{quote_id}")
async def request_shipment(
    request: Request,
    quote_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await ShippingService.request_shipment(
        request=request,
        db=db,
        quote_id=quote_id,
        current_user=current_user
    )


@router.get("/connect/onboarding-link/{user_id}")
async def get_onboarding_link(user_id: int, db: AsyncSession = Depends(get_db)):
    service = PaymentService(db)
    return await service.generate_onboarding_link(user_id)