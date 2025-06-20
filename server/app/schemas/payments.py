from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


class UserInfo(BaseModel):
    id: int
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)
    
class PaymentOut(BaseModel):
    id: int
    order_id: int
    method: str
    status: str
    transaction_id: str
    created_at: datetime
    user: Optional[UserInfo] 

    model_config = ConfigDict(from_attributes=True)

class PaymentListRequest(BaseModel):
    search: Optional[str] = None
    sort_by: str = "name"
    order_by: str = "asc"
    current_page: int = 1
    limit: int = 10
