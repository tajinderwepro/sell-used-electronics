from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.media import Media 
from sqlalchemy.orm import foreign
from app.models.base import TimestampMixin

class Brand(Base,TimestampMixin):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    media_id = Column(Integer, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="brands")
    models = relationship("Model", back_populates="brand", cascade="all, delete-orphan")
   
    media = relationship(
    "Media",
    primaryjoin="and_(foreign(Media.mediable_id)==Brand.id, Media.mediable_type=='brand')",
    viewonly=True,
    uselist=True
)





