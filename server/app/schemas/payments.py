# app/models/payment.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    method = Column(String, nullable=False)
    status = Column(String, nullable=False)
    transaction_id = Column(String, nullable=False)

    # Relationships
    order = relationship("Order")
