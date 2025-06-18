from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
# from app.models.mixins import TimestampMixin  
from app.models.base import TimestampMixin

class QuoteHistory(Base, TimestampMixin):
    __tablename__ = "quote_histories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    model_id = Column(Integer, ForeignKey("models.id"), nullable=True)

    user = relationship("User")
    model = relationship("Model")
