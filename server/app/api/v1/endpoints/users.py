from fastapi import APIRouter,Depends, HTTPException, status
from typing import List
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, UserResponse,UserListResponse,UserUpdate
from app.services.user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.device import DeviceListResponse

router = APIRouter()

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    return await UserService.create_user(user)

@router.get("/list", response_model=UserListResponse)
async def list_users():
    return await UserService.get_all_users()

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
    user: UserUpdate,  
    db: AsyncSession = Depends(get_db)
):
    print(user_id)
    print(user.model_dump(exclude_unset=True))  
    return await UserService.update_user(user_id, user, db)

@router.get("/devices/{user_id}")
async def get_user(user_id: int,db: AsyncSession = Depends(get_db)):
    devices = await UserService.get_user_devices(user_id,db)
    if not devices:
        raise HTTPException(status_code=404, detail="Devices not found")
    return devices

@router.get("/user/{user_id}", response_model=DeviceListResponse)
async def get_user_devices(user_id: int, db: AsyncSession = Depends(get_db)):
    return await DeviceService.get_user_devices(user_id, db)


