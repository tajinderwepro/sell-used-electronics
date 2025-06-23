# app/models/order.py
from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin

class Order(Base,TimestampMixin):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey('quotes.id'), nullable=False, default="pending")
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  
    status = Column(String, nullable=False)  
    tracking_number = Column(String, nullable=True)
    shipping_label_url = Column(String, nullable=True)

    # Relationships
    quote = relationship("Quote")
    payment = relationship("Payment", back_populates="order", uselist=True)
    user = relationship("User", back_populates="orders")
