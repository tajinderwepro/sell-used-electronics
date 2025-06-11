from pydantic import BaseModel
from typing import Optional

class AddressCreate(BaseModel):
    address: str
    city: str
    state: str
    zip: str
    country: Optional[str] = None
    id: Optional[int] = None


class AddressOut(AddressCreate):
    id: int
    user_id: int
    class Config:
        orm_mode = True


class AddressResponse(BaseModel):
    address: Optional[AddressOut]
    message: str
    success: bool

    class Config:
        from_attributes = True