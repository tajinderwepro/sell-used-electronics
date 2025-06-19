# models/log.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base
from app.models.base import TimestampMixin

class Log(Base,TimestampMixin):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, index=True)
    description = Column(Text)
    ip_address = Column(String)
    os = Column(String)
    browser = Column(String)


    # user = relationship("User", back_populates="logs")

