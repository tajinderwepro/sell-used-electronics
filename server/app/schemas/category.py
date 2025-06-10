from pydantic import BaseModel
from typing import Optional, List
from app.schemas.media import MediaOut
# Base schema for input
class CategoryBase(BaseModel):
    name: str
    media_id: Optional[int] = None

# Create schema
class CategoryCreate(CategoryBase):
    pass

# Update schema (not used now, but kept for later)
class CategoryUpdate(CategoryBase):
    pass

# Output schemas for nested Brand and Model
class BrandOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    category_id: int

    class Config:
        orm_mode = True

class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

    class Config:
        orm_mode = True
        
class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    class Config:
        orm_mode = True

class CategoryOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brands: List[BrandOut] = []
    models: List[ModelOut] = []
    media: List[MediaOut] = []  # ← include media here

    class Config:
        orm_mode = True