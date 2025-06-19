from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin

class Payment(Base,TimestampMixin):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    method = Column(String, default="stripe")
    status = Column(String, default="pending")  # pending, success, failed
    transaction_id = Column(String, nullable=True)

    order = relationship("Order", back_populates="payment")
    # user = relationship("User", back_populates="payments")


    