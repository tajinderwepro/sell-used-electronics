from pydantic import BaseModel
from typing import Optional, Literal,List
from pydantic.config import ConfigDict
from datetime import datetime
from app.schemas.quote import MediaBase

class OrderBase(BaseModel):
    quote_id: int
    status: Literal['pending', 'received', 'paid']
    tracking_number: Optional[str] = None
    shipping_label_url: Optional[str] = None

class QuoteBase(BaseModel):
    id: int
    category_name: Optional[str]
    brand_name: Optional[str]
    model_name: Optional[str]
    risk_score: Optional[int]
    condition: str
    offered_price: float
    user_id: Optional[int]
    status: Optional[str]
    category_id: Optional[int]
    brand_id: Optional[int]
    model_id: Optional[int]
    model_config = ConfigDict(from_attributes=True)
    media: List[MediaBase] = [] 


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    status: Optional[Literal['pending', 'received', 'paid']] = None
    tracking_number: Optional[str] = None
    shipping_label_url: Optional[str] = None


class OrderOut(BaseModel):
    id: int
    quote_id: int | None = None
    status: str
    tracking_number: str | None = None
    shipping_label_url: str | None = None
    quote: QuoteBase | None = None  # 👈 change from `dict` to `QuoteOut`
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = {
        "from_attributes": True  
    }
    
class OrderListResponse(BaseModel):
    data: List[OrderOut]
    message: str
    success: bool

    class Config:
        orm_mode = True

class OrderListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "name"
    order_by: str = "asc"
    current_page: int = 1
    limit: int = 10