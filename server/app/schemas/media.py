from pydantic import BaseModel
from typing import Optional, List

class MediaOut(BaseModel):
    id: int
    path: str
    mediable_type: str
    mediable_id: int

    class Config:
        orm_mode = True

