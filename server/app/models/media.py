from sqlalchemy import Column, Integer, String
from app.db.session import Base

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, nullable=False)
    mediable_type = Column(String, nullable=False)
    mediable_id = Column(Integer, nullable=False)

    # Optional: Add a unique constraint or composite index via __table_args__
    __table_args__ = (
        # Composite index to optimize polymorphic queries
        {'sqlite_autoincrement': True},  # Optional for SQLite
    )
