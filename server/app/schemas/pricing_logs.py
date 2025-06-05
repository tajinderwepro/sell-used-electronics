# app/models/pricing_log.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class PricingLog(Base):
    __tablename__ = 'pricing_logs'

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey('devices.id'), nullable=False)
    avg_price = Column(Float, nullable=False)
    source = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    device = relationship("Device")
