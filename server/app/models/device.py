# app/models/device.py
from sqlalchemy import Column, Integer, String, Float,ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship

class Device(Base):
    __tablename__ = 'devices'

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    base_price = Column(Float, nullable=False)
    ebay_avg_price = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="pending",nullable=True)

    #  relationship
    user = relationship("User", back_populates="devices")

