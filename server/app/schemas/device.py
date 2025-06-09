from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List
from pydantic import BaseModel


class DeviceCreate(BaseModel):
    category: str
    brand: str
    model: str
    condition: str
    base_price: float
    ebay_avg_price: float

class DeviceOut(BaseModel):
    id: int
    category: str
    brand: str
    model: str
    condition: str
    base_price: float
    ebay_avg_price: float

    class Config:
        from_attributes = True

class DeviceListResponse(BaseModel):
    data: List[DeviceOut]
    message: str
    success: bool

    class Config:
        from_attributes = True

class DeviceUpdate(BaseModel):
    category: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    condition: Optional[str]
    base_price: Optional[float]
    ebay_avg_price: Optional[float]

    class Config:
        orm_mode = True

class CategoryCreate(BaseModel):
    category: str

class BrandCreate(BaseModel):
    category: str
    brand: str

class ModelCreate(BaseModel):
    category: str
    brand: str
    model: str
