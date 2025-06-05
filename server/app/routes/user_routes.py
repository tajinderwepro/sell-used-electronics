from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserOut, UserListResponse
from app.controllers import user_controller

router = APIRouter()

@router.post("/users/", response_model=UserOut)
def create(user: UserCreate, db: Session = Depends(get_db)):
    return user_controller.create_user(db, user)

@router.get("/users/", response_model=UserListResponse)
def read_all(db: Session = Depends(get_db)):
    return user_controller.get_users(db)

@router.get("/users/{user_id}", response_model=UserOut)
def read_one(user_id: int, db: Session = Depends(get_db)):
    user = user_controller.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}", response_model=UserOut)
def delete(user_id: int, db: Session = Depends(get_db)):
    user = user_controller.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
