from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    admin = 'admin'
    user = 'user'

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user)

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

class UserListResponse(BaseModel):
    users: list[UserOut]
    message: str
    success: bool

class Config:
    orm_mode = True


