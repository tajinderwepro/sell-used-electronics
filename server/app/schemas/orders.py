from pydantic import BaseModel
from typing import Optional, Literal,List


class OrderBase(BaseModel):
    quote_id: int
    status: Literal['pending', 'received', 'paid']
    tracking_number: Optional[str] = None
    shipping_label_url: Optional[str] = None


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

    model_config = {
        "from_attributes": True  
    }
    
class OrderListResponse(BaseModel):
    data: List[OrderOut]
    message: str
    success: bool

    class Config:
        orm_mode = True
