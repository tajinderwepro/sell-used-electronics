from pydantic import BaseModel
from typing import Optional, List

class CategoryBase(BaseModel):
    name: str
    media_id: Optional[int]

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

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

class CategoryOut(CategoryBase):
    id: int
    brands: Optional[List[BrandOut]] = []
    models: Optional[List[ModelOut]] = []

    class Config:
        orm_mode = True