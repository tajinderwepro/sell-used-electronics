from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List
from pydantic import BaseModel
from pydantic.config import ConfigDict

class DeviceCreate(BaseModel):
    category: str
    brand: str
    model: str
    condition: str
    base_price: float
    ebay_avg_price: float

class CategoryBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class BrandBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class ModelBase(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True

class DeviceOut(BaseModel):
    id: int
    category: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    condition: str
    base_price: float
    ebay_avg_price: float
    user_id: Optional[int]
    status: Optional[str]
    category_id: Optional[int]
    brand_id: Optional[int]
    model_id: Optional[int]
    category_rel: Optional[CategoryBase]
    brand_rel: Optional[BrandBase]
    model_rel: Optional[ModelBase]
    model_config = ConfigDict(from_attributes=True)

class DeviceUpdate(BaseModel):
    category: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    condition: Optional[str]
    base_price: Optional[float]
    ebay_avg_price: Optional[float]
    status: Optional[str]
    user_id: Optional[int]

    class Config:
        orm_mode = True

class DeviceStatusUpdate(BaseModel):
    status: str

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

class DeviceResponse(BaseModel):
    id: int
    category_id: int | None
    brand_id: int | None
    model_id: int | None
    condition: str | None
    base_price: float | None
    ebay_avg_price: float | None
    status: str | None
    user_id: int | None

    model_config = ConfigDict(from_attributes=True)
class DeviceListResponse(BaseModel):
    data: list[DeviceResponse]
    message: str
    success: bool
    
    class Config:
        orm_mode = True