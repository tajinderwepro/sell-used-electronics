# app/models/device.py
from sqlalchemy import Column, Integer, String, Float
from app.db.session import Base

class Device(Base):
    __tablename__ = 'devices'

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    base_price = Column(Float, nullable=False)
    ebay_avg_price = Column(Float, nullable=False)
