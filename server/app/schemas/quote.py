from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List,Union
from pydantic import BaseModel
from pydantic.config import ConfigDict
from datetime import datetime
class QuoteCreate(BaseModel):
    category: str
    brand: str
    model: str
    condition: str
    offered_price: float
    imei: Optional[str] | None
    specifications: Optional[dict] | None
    ebay_avg_price: Optional[float] | None

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

class MediaBase(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    model_config = ConfigDict(from_attributes=True)
class UserBase(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[int]
    role: Optional[str]
    model_config = ConfigDict(from_attributes=True)

class QuoteOut(BaseModel):
    id: int
    category_name: Optional[str]
    brand_name: Optional[str]
    model_name: Optional[str]
    risk_score: Optional[int]
    imei: Optional[str] = None
    specifications: Optional[Union[dict, str]] = None
    condition: str
    offered_price: float
    user_id: Optional[int]
    status: Optional[str]
    category_id: Optional[int]
    brand_id: Optional[int]
    model_id: Optional[int]
    category: Optional[CategoryBase]
    brand: Optional[BrandBase]
    model: Optional[ModelBase]
    user: Optional[UserBase]
    media: List[MediaBase] = [] 
    model_config = ConfigDict(from_attributes=True)
    created_at:Optional[datetime] = None
    updated_at: Optional[datetime] = None
    amount: Optional[float] = None
 
class QuoteUpdate(BaseModel):
    category: Optional[str]
    brand: Optional[str]
    model: Optional[str]
    condition: Optional[str]
    offered_price: Optional[float]
    status: Optional[str]
    user_id: Optional[int]

    class Config:
        orm_mode = True

class QuoteStatusUpdate(BaseModel):
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


class QuoteResponse(BaseModel):
    id: int
    category_id: int | None
    brand_id: int | None
    model_id: int | None
    condition: str | None
    offered_price: float | None
    status: str | None
    user_id: int | None
    category: str | None = None
    brand: str | None = None
    model: str | None = None
    category: CategoryBase | None = None
    brand: BrandBase | None = None
    model: ModelBase | None = None
    user: UserBase | None = None

    model_config = ConfigDict(from_attributes=True)

class QuoteSubmitResponse(BaseModel):
    condition: str
    images: List[str]

    class Config:
        from_attributes = True


class QuoteListResponse(BaseModel):
    data: list[QuoteOut]
    message: str
    success: bool
    total: int | None = None
    class Config:
        orm_mode = True

class QuoteListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "name"
    order_by: str = "asc"
    current_page: int = 1
    limit: int = 10

    
class QuoteSingleResponse(BaseModel):
    data: Optional[QuoteOut] = None
    message: Optional[str] = None
    success: Optional[bool] = None

    model_config = {
        "from_attributes": True
    }

class QuoteApprove(BaseModel):
    message: Optional[str] = None
    success: Optional[bool] = None

    model_config = {
        "from_attributes": True
    }
