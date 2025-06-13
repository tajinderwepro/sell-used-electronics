from pydantic import BaseModel
from typing import Optional, List,Generic, TypeVar
from .model import ModelOut
from .media import MediaOut
from pydantic.generics import GenericModel

# Assuming you have these schemas defined elsewhere
# from app.schemas.media import MediaOut
# from app.schemas.model import ModelOut

T = TypeVar("T")


# schemas/brand.py
class BrandBase(BaseModel):
    id: int
    name: str
    media_id: Optional[int] = None  
    class Config:
        orm_mode = True

class ListResponse(GenericModel, Generic[T]):
    success: bool
    status_code: int
    data: List[T]

class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    model_config = {
    "from_attributes": True
    }

class ModelListRequest(BaseModel):
    limit: int = 10
    offset: int = 0

class BrandUpdate(BaseModel):
    name: Optional[str] = None


class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

    model_config = {
    "from_attributes": True
    }

class BrandBase(BaseModel):
    name: str
    category_id: int

class BrandCreate(BrandBase):
    pass

class BrandUpdate(BrandBase):
    name: Optional[str] = None  # Allow updating name
    category_id: Optional[int] = None # Allow updating category_id

class BrandOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    category_id: int
    media: List[MediaOut] = []

    model_config = {
    "from_attributes": True
    }
