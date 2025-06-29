# app/models/quote.py
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base
from app.models.base import TimestampMixin
from app.models.note import Note 
from sqlalchemy.orm import foreign
from sqlalchemy import and_
class Quote(Base,TimestampMixin):
    __tablename__ = 'quotes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    model_id = Column(Integer, ForeignKey('models.id'), nullable=True)
    brand_id = Column(Integer, ForeignKey('brands.id'), nullable=True)
    
    category_name = Column(String, nullable=True)
    model_name = Column(String, nullable=True)
    brand_name = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    offered_price = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)
    status = Column(String(50), nullable=False, server_default="pending")
    imei = Column(String(50), nullable=True)
    specifications = Column(Text, nullable=True) 
    amount = Column(Float, nullable=True)
    shipment_id = Column(String, nullable=True)
    shipment_retry_status = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="quotes")
    category = relationship("Category")
    brand = relationship("Brand")
    model = relationship("Model")

    media = relationship(
            "Media",
            primaryjoin="and_(foreign(Media.mediable_id)==Quote.id, Media.mediable_type=='quote')",
            viewonly=True,
            uselist=True
        )

    notes = relationship(
            "Note",
            primaryjoin="and_(foreign(Note.notiable_id)==Quote.id, Note.notiable_type=='quote')",
            viewonly=True,
            uselist=True
        )