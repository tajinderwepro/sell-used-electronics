# app/models/quote.py
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Quote(Base):
    __tablename__ = 'quotes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    device_id = Column(Integer, ForeignKey('devices.id'), nullable=False)
    condition = Column(String, nullable=False)
    offered_price = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quotes")
    device = relationship("Device")
