from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    media_id = Column(Integer, nullable=True)

    # Relationships
    brands = relationship("Brand", back_populates="category", cascade="all, delete-orphan")
    models = relationship("Model", back_populates="category", cascade="all, delete-orphan")


