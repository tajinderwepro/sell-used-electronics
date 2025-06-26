from pydantic import BaseModel
from typing import Optional

class RiskManagementBase(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None
    score: Optional[int] = None

class RiskManagementCreate(RiskManagementBase):
    pass

class RiskManagementUpdate(RiskManagementBase):
    score: Optional[int] = None
    
class RiskManagementOut(RiskManagementBase):
    id: int

    class Config:
        orm_mode = True
