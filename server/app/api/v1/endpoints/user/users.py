from fastapi import APIRouter,Depends, HTTPException, status, Query, Body, Form, UploadFile, File
from typing import List
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, UserResponse,UserListResponse,UserUpdate, UserListRequest
from app.schemas.device import DeviceListRequest
from app.services.user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import uuid4
import os
from app.schemas.device import DeviceListResponse
from app.utils.file_utils import save_upload_file
from app.core.config import settings

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
        limit=filters.limit
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

@router.post("/devices/{user_id}")
async def get_user_devices(
    user_id: int, 
    filters: DeviceListRequest = Body(...),
    db: AsyncSession = Depends(get_db),
):
    return await UserService.get_user_devices(
        db=db,
        search=filters.search,
        sort_by=filters.sort_by,
        order_by=filters.order_by,
        current_page=filters.current_page,
        limit=filters.limit,
        user_id=user_id
    )


