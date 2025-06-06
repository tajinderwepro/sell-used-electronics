import asyncio
from app.db.session import async_session
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from current folder (backend/)
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_users():
    async with async_session() as session:
        async with session.begin():
            # Check if users already exist
            result = await session.execute(select(User))
            users = result.scalars().all()
            if users:
                print("Users already seeded.")
                return

            user1 = User(
                name="Admin User",
                email="admin@yopmail.com",
                password_hash=pwd_context.hash("password"),
                role="admin"
            )
            session.add_all([user1])
        await session.commit()
        print("Users seeded successfully.")

if __name__ == "__main__":
    asyncio.run(create_users())
