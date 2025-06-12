from pydantic import BaseModel
from typing import Optional, List,Generic, TypeVar
from .media import MediaOut
from pydantic.generics import GenericModel


T = TypeVar("T")

class ListResponse(GenericModel, Generic[T]):
    success: bool
    status_code: int
    data: List[T]

class ModelBase(BaseModel):
    name: str
    media_id: Optional[int] = None  
    category_id: int
    # base_price: Optional[float] = None 

class ModelCreate(ModelBase):
    pass

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

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    media_id: Optional[int] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None

    class Config:
        orm_mode = True

class ModelUpdate(BaseModel):
    name: Optional[str] = None
    media_id: Optional[int] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None


class ModelOut(BaseModel):
    id: int
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int
    media: List[MediaOut] = []

    model_config = {
    "from_attributes": True
    }
