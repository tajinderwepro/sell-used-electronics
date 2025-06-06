from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas.user import UserCreate, UserOut, UserResponse,UserListResponse
from app.services.user_service import UserService

router = APIRouter()

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    return await UserService.create_user(user)

@router.get("/list", response_model=UserListResponse)
async def list_users():
    return await UserService.get_all_users()

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}", response_model=UserOut)
def delete(user_id: int):
    user = UserService.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

