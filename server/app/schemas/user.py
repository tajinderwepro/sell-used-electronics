from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List
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


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str

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
    users: List[UserOut]
    message: str
    success: bool

    class Config:
        from_attributes = True


