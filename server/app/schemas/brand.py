from pydantic import BaseModel
from typing import Optional, List
from app.schemas.media import MediaOut  # Import your existing MediaOut

class BrandBase(BaseModel):
    name: str
    media_id: Optional[int] = None
    category_id: int

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BrandBase):
    pass

# Add these if you need to show models in the brand response
class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

    class Config:
        orm_mode = True

# Enhanced BrandOut with media support
class BrandOut(BrandBase):
    id: int
    brands: List = []  # If you need nested brands
    models: List[ModelOut] = []  # If you need models
    media: List[MediaOut] = []  # This is the key addition

    class Config:
        orm_mode = True