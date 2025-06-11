from pydantic import BaseModel
from typing import Optional, List

# Assuming you have these schemas defined elsewhere
# from app.schemas.media import MediaOut
# from app.schemas.model import ModelOut

class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    class Config:
        orm_mode = True

class ModelListRequest(BaseModel):
    limit: int = 10
    offset: int = 0

class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

    class Config:
        orm_mode = True

class BrandBase(BaseModel):
    name: str
    category_id: int

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BrandBase):
    name: Optional[str] = None  # Allow updating name
    category_id: Optional[int] = None # Allow updating category_id

class BrandOut(BrandBase):
    id: int
    media: List[MediaOut] = []  # List of associated media
    models: List[ModelOut] = []  # List of associated models

    class Config:
        orm_mode = True
