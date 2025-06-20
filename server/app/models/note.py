from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base 
from app.models.base import TimestampMixin



class Note(Base,TimestampMixin):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    notiable_id = Column(Integer, nullable=True)
    notiable_type = Column(String(255), nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    content = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Optional relationships if you want to reference users
    # user = relationship("User", foreign_keys=[user_id], backref="notes_for_user")
    # added_by_user = relationship("User", foreign_keys=[added_by], backref="notes_added_by")


