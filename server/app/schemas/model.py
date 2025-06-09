from pydantic import BaseModel
from typing import Optional

class ModelBase(BaseModel):
    name: str
    media_id: Optional[int]
    brand_id: int
    category_id: int

class ModelCreate(ModelBase):
    pass

class ModelUpdate(ModelBase):
    pass

class ModelOut(ModelBase):
    id: int

    class Config:
        orm_mode = True
