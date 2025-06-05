# app/models/order.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=True)
    quote_id = Column(Integer, ForeignKey('quotes.id'), nullable=False)
    status = Column(Enum('pending', 'received', 'paid', name='order_statuses'), nullable=False)
    tracking_number = Column(String, nullable=True)
    shipping_label_url = Column(String, nullable=True)

    # Relationships
    quote = relationship("Quote")
