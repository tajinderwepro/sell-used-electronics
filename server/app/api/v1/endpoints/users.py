from fastapi import APIRouter,Depends, HTTPException, status, Query, Body
from typing import List
from app.db.session import get_db
from app.schemas.user import UserCreate, UserOut, UserResponse,UserListResponse,UserUpdate, UserListRequest
from app.schemas.device import DeviceListRequest
from app.services.user_service import UserService
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.schemas.device import DeviceListResponse

router = APIRouter()

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
    user: UserUpdate,  
    db: AsyncSession = Depends(get_db)
):
    print(user_id)
    print(user.model_dump(exclude_unset=True))  
    return await UserService.update_user(user_id, user, db)

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


