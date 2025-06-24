from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func, and_
from sqlalchemy.orm import relationship, foreign
from app.db.session import Base 
from app.models.base import TimestampMixin

class Note(Base, TimestampMixin):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)

    notiable_id = Column(Integer, nullable=True)
    notiable_type = Column(String(255), nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    content = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="notes", foreign_keys=[added_by])
    # added_by_user = relationship("User", foreign_keys=[added_by], back_populates="notes_created")

    # ✅ Use string-based class name and lazy primaryjoin evaluation
    # quote = relationship(
    #     "Quote",
    #     primaryjoin=lambda: and_(
    #         foreign(Note.notiable_id) == foreign("Quote.id"),
    #         Note.notiable_type == "quote"
    #     ),
    #     back_populates="notes",
    #     lazy="selectin"
    # )
    quote = relationship(
        "Quote",
        primaryjoin="and_(foreign(Note.notiable_id)==Quote.id, Note.notiable_type=='quote')",
        viewonly=True,
        uselist=True
    )
    order = relationship(
        "Order",
        primaryjoin="and_(foreign(Note.notiable_id)==Order.id, Note.notiable_type=='order')",
        viewonly=True,
        uselist=True
    )

    


    




