from sqlalchemy import Column, Integer, String, Enum as SAEnum,and_,BigInteger,Boolean, DateTime
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
    phone = Column(BigInteger, nullable=False, unique=True)

    stripe_account_id = Column(String, nullable=True)
    charges_enabled = Column(Boolean, nullable=True)
    payouts_enabled = Column(Boolean, nullable=True)
    details_submitted = Column(Boolean, nullable=True)
    stripe_account_status = Column(String, nullable=True)
    onboarding_completed_at = Column(DateTime, nullable=True)

    devices = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    quotes = relationship("Quote", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user")
    media = relationship(
        "Media",
        primaryjoin=and_(
            foreign(Media.mediable_id) == id,
            Media.mediable_type == "user"
        ),
        backref="user"
    )
    logs = relationship("Log", back_populates="user")
    # payments = relationship("Payment", back_populates="user", lazy="selectin")



    