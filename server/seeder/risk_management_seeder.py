import asyncio
import os
import sys
import json

# Ensure root directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import async_session
from app.models.risk_management import RiskManagement
from sqlalchemy import select


async def seed_risk_management():
    async with async_session() as session:
        result = await session.execute(select(RiskManagement).where(RiskManagement.key.in_(["risky_domains", "high_risk_countries"])))
        existing = result.scalars().all()
        if existing:
            print("RiskManagement table already seeded.")
            return

        risky_domains = {"tempmail.com", "10minutemail.com", "mailinator.com"}
        high_risk_countries = {"NG", "GH", "PK"}

        items = [
            RiskManagement(key="risky_domains", value=json.dumps(list(risky_domains))),
            RiskManagement(key="high_risk_countries", value=json.dumps(list(high_risk_countries))),
        ]

        session.add_all(items)
        await session.commit()
        print("Seeded risk_managements table successfully.")

if __name__ == "__main__":
    asyncio.run(seed_risk_management())
