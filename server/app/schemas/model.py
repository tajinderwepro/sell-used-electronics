from pydantic import BaseModel
from typing import Optional, List


class ModelBase(BaseModel):
    name: str
    media_id: Optional[int] = None  
    category_id: int

class ModelCreate(ModelBase):
    pass

class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    class Config:
        orm_mode = True

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    media_id: Optional[int] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None

class ModelOut(ModelBase):
    id: int
    media: List[MediaOut] = []  

    class Config:
        orm_mode = True
