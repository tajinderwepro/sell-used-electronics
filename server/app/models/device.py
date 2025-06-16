# app/models/device.py
from sqlalchemy import Column, Integer, String, Float,ForeignKey
from app.db.session import Base
from sqlalchemy.orm import relationship
from app.models.base import TimestampMixin

class Device(Base,TimestampMixin):
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
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=True)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=True)

    # Relationships
    category_rel = relationship("Category", back_populates="devices")
    brand_rel = relationship("Brand", back_populates="devices")
    model_rel = relationship("Model", back_populates="devices")
    user = relationship("User", back_populates="devices")


