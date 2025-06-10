from pydantic import BaseModel
from typing import Optional, List

class MediaOut(BaseModel):
    id: int
    mediable_type: str
    mediable_id: Optional[int]

    class Config:
        orm_mode = True

