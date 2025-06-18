from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.media import Media 
from sqlalchemy.orm import foreign
from app.models.base import TimestampMixin

class Model(Base,TimestampMixin):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    media_id = Column(Integer, nullable=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    # base_price = Column(Float, nullable=False)

    # Relationships
    brand = relationship("Brand", back_populates="models")
    category = relationship("Category", back_populates="models")
    devices = relationship("Device", back_populates="model_rel")
    quotes = relationship("Quote", back_populates="model", cascade="all, delete-orphan")
    media = relationship(
        "Media",
        primaryjoin="and_(foreign(Media.mediable_id)==Model.id, Media.mediable_type=='model')",
        viewonly=True,
        uselist=True
    )
    

