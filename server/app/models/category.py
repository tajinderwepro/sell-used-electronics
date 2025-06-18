from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.media import Media 
from sqlalchemy.orm import foreign
from app.models.base import TimestampMixin

class Category(Base,TimestampMixin):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    media_id = Column(Integer, nullable=True)

    # Relationships
    brands = relationship("Brand", back_populates="category", cascade="all, delete-orphan")
    models = relationship("Model", back_populates="category", cascade="all, delete-orphan")
    quotes = relationship("Quote", back_populates="category", cascade="all, delete-orphan")
    media = relationship(
        "Media",
        primaryjoin="and_(foreign(Media.mediable_id)==Category.id, Media.mediable_type=='category')",
        viewonly=True,
        uselist=True
    )

    devices = relationship("Device", back_populates="category_rel")