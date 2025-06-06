from sqlalchemy import Column, Integer, String, Enum as SAEnum
from app.db.session import Base
import enum

class RoleEnum(str, enum.Enum):
    admin = 'admin'
    user = 'user'

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
