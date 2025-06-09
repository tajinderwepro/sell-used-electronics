from pydantic import BaseModel
from typing import Optional

class BrandBase(BaseModel):
    name: str
    media_id: Optional[int]
    category_id: int

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BrandBase):
    pass

class BrandOut(BrandBase):
    id: int

    class Config:
        orm_mode = True
