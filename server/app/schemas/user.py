from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
import enum

class RoleEnum(str, enum.Enum):
    admin = 'admin'
    user = 'user'

# Pydantic schemas
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password_hash: str
    role: RoleEnum

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: RoleEnum

class UserResponse(BaseModel):
    users: list[UserOut]
    message: str
    success: bool

class Config:
    orm_mode = True


