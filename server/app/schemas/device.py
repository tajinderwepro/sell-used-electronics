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

    model_config = ConfigDict(from_attributes=True)

class BrandBase(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ModelBase(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[int]
    role: Optional[str]
    model_config = ConfigDict(from_attributes=True)

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
    user: Optional[UserBase]
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
    user_id: Optional[int]


    class Config:
        orm_mode = True

class CategoryCreate(BaseModel):
    category: str
    
    model_config = ConfigDict(from_attributes=True)

class BrandCreate(BaseModel):
    category: str
    brand: str

    model_config = ConfigDict(from_attributes=True)


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
    category: str | None = None
    brand: str | None = None
    model: str | None = None
    category_rel: CategoryBase | None = None
    brand_rel: BrandBase | None = None
    model_rel: ModelBase | None = None
    user: UserBase | None = None
    model_config = ConfigDict(from_attributes=True)



class DeviceListResponse(BaseModel):
    data: list[DeviceOut]
    message: str
    success: bool
    total: int | None = None
    class Config:
        orm_mode = True

class DeviceListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "name"
    order_by: str = "asc"
    current_page: int = 1
    limit: int = 10

    
class DeviceSingleResponse(BaseModel):
    data: Optional[DeviceOut] = None
    message: Optional[str] = None
    success: Optional[bool] = None

    model_config = {
        "from_attributes": True
    }

class DeviceApprove(BaseModel):
    message: Optional[str] = None
    success: Optional[bool] = None

    model_config = {
        "from_attributes": True
    }
