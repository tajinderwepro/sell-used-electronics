from sqlalchemy import Column, Integer, String, Enum as SAEnum,and_
from app.db.session import Base
from sqlalchemy.orm import relationship,backref, foreign
import enum
from app.models.base import TimestampMixin
from app.models.media import Media
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
    phone = Column(Integer, nullable=False, unique=True)


    devices = relationship("Device", back_populates="user_rel", cascade="all, delete-orphan")
    media = relationship(
        "Media",
        primaryjoin=and_(
            foreign(Media.mediable_id) == id,
            Media.mediable_type == "user"
        ),
        backref="user"
    )

    