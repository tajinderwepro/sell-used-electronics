from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
from app.core.config import settings  

load_dotenv()

DATABASE_URL = settings.DATABASE_URL
print("DB URL:", DATABASE_URL)

# Use asyncpg driver prefix for async engine
async_database_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    async_database_url,
    echo=True,  # Optional: logs SQL queries
)

# Async session factory
async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

# Dependency to use with FastAPI
async def get_db():
    async with async_session() as session:
        yield session
