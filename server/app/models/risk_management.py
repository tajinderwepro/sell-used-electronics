from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db.session import Base 
from app.models.base import TimestampMixin

class RiskManagement(Base,TimestampMixin):
    __tablename__ = "risk_managements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=True)
    value = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
