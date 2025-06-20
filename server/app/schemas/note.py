from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class UserInfo(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class NoteOut(BaseModel):
    id: int
    notiable_id: Optional[int]
    notiable_type: Optional[str]
    user_id: Optional[int]
    added_by: Optional[int]
    content: Optional[str]
    created_at: datetime
    updated_at: datetime

    user: Optional[UserInfo] = None
    added_by_user: Optional[UserInfo] = None

    model_config = ConfigDict(from_attributes=True)


class NoteListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "created_at"
    order_by: str = "desc"
    current_page: int = 1
    limit: int = 10

class NoteCreate(BaseModel):
    notiable_id: Optional[int] = None
    notiable_type: Optional[str] = None
    user_id: Optional[int] = None  
    content: Optional[str] = None
