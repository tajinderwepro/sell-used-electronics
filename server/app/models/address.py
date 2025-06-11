from sqlalchemy import Column, Integer, String, ForeignKey, Boolean 
from sqlalchemy.orm import relationship
from app.db.session import Base

class Address(Base):
    __tablename__ = 'addresses'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    zip = Column(String, nullable=False)
    country = Column(String, nullable=False)
    status = Column(Boolean, nullable=False)

    # user = relationship("User", back_populates="addresses")
