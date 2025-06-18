# app/models/quote.py
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base
from app.models.base import TimestampMixin

class Quote(Base,TimestampMixin):
    __tablename__ = 'quotes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    model_id = Column(Integer, ForeignKey('models.id'), nullable=False)
    brand_id = Column(Integer, ForeignKey('brands.id'), nullable=False)
    
    category_name = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    brand_name = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    offered_price = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)

    # Relationships
    user = relationship("User", back_populates="quotes")
    category = relationship("Category")
    brand = relationship("Brand")
    model = relationship("Model")
