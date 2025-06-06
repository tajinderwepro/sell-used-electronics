from sqlalchemy import Column, Integer, String, Enum
from app.db.session import Base
from typing import Optional ,List
from pydantic import BaseModel

class DeviceOut(BaseModel):
    id: int
    category: str
    brand: str
    model: str
    condition: str
    base_price: float
    ebay_avg_price: float
    
class DeviceListResponse(DeviceOut):
    data: List[DeviceOut]
    message: str
    success: bool

    class Config:
        from_attributes = True


