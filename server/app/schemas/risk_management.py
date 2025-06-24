from pydantic import BaseModel
from typing import Optional

class RiskManagementBase(BaseModel):
    key: Optional[str] = None
    value: Optional[str] = None

class RiskManagementCreate(RiskManagementBase):
    pass

class RiskManagementUpdate(RiskManagementBase):
    pass

class RiskManagementOut(RiskManagementBase):
    id: int

    class Config:
        orm_mode = True
