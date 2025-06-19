from pydantic import BaseModel, ConfigDict
from datetime import datetime

class PaymentOut(BaseModel):
    id: int
    order_id: int
    method: str
    status: str
    transaction_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
