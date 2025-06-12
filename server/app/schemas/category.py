from pydantic import BaseModel
from typing import Optional, List,Generic, TypeVar
from .brand import BrandOut
from .model import ModelOut
from .media import MediaOut
from pydantic.generics import GenericModel

T = TypeVar("T")


class CategoryBase(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True
class ListResponse(GenericModel, Generic[T]):
    success: bool
    status_code: int
    data: List[T]

class CategoryBase(BaseModel):
    name: str
    media_id: Optional[int] = None

class CategoryCreate(BaseModel):
    name: str

    class Config:
        arbitrary_types_allowed = True

class CategoryUpdate(CategoryBase):
    pass

class BrandOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    category_id: int

    model_config = {
    "from_attributes": True
    }

class CategoryUpdate(BaseModel):
    name: str

    class Config:
       orm_mode = True

class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

    model_config = {
    "from_attributes": True
    }

class ModelListRequest(BaseModel):
    limit: int = 10
    offset: int = 0
        
class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    model_config = {
    "from_attributes": True
    }


class CategoryOut(BaseModel):
    id: int
    name: str
    media: List[MediaOut] = []
    brands: List[BrandOut] = []
    models: List[ModelOut] = []

    model_config = {
    "from_attributes": True
    }