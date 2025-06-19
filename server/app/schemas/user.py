from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List
from .media import MediaOut
from datetime import datetime

import enum

class RoleEnum(str, enum.Enum):
    admin = 'admin'
    user = 'user'

# Pydantic schemas
from pydantic import BaseModel


# ------------------ SCHEMAS ------------------

class UserCreate(BaseModel):
    name: str
    email: str
    password_hash: str
    role: str
    phone:Optional[int] = None

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[int] = None
    stripe_account_id: Optional[str] = None
    stripe_account_status: Optional[str] = None
    charges_enabled : Optional[bool] = None
    payouts_enabled : Optional[bool] = None
    details_submitted : Optional[bool] = None
    onboarding_completed_at: Optional[datetime] = None
    # media: Optional[MediaOut] = None

    class Config:
        from_attributes = True  

class UserResponse(BaseModel):
    user: UserOut
    message: str
    success: bool
    error: Optional[str] = None

    class Config:
        from_attributes = True


class RegisterUserResponse(BaseModel):
    user: Optional[UserOut] = None
    message: str
    success: bool
    error: Optional[str] = None

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    data: List[UserOut]
    message: str
    success: bool
    total: int
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None  
    phone: Optional[int] = None  

    class Config:
        from_attributes = True

class UserListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "name"
    order_by: str = "asc"
    current_page: int = 1
    limit: int = 10