# app/models/order.py
from sqlalchemy import Column, Integer, String, ForeignKey, Enum,Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.session import Base
from app.models.base import TimestampMixin
from sqlalchemy.dialects.postgresql import JSONB

class Order(Base,TimestampMixin):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey('quotes.id'), nullable=False, default="pending")
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  
    status = Column(String, nullable=False)  
    tracking_number = Column(String, nullable=True)
    shipping_label_url = Column(String, nullable=True)
    tracking_url = Column(String, nullable=True)
    total_amount = Column(Integer, nullable=False)  # Assuming total amount is in cents
    ebay_avg_price = Column(String, nullable=True)
    shipment_fees = Column(JSONB, nullable=True)  # ✅ Handles list of dicts
    # Relationships
    quote = relationship("Quote")
    payment = relationship("Payment", back_populates="order", uselist=True)
    user = relationship("User", back_populates="orders")
