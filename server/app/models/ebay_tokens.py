from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class EbayToken(Base):
    __tablename__ = "ebay_tokens"

    id = Column(Integer, primary_key=True)
    environment = Column(String, unique=True)  # "sandbox" or "production"
    access_token = Column(String)
    expires_at = Column(DateTime)  # UTC timestamp
