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
        result = await session.execute(
            select(RiskManagement).where(
                RiskManagement.key.in_([
                    "risky_domains",
                    "high_risk_countries",
                    "email_domain_check",
                    "duplicate_serial_check",
                    "repeated_quotes_check",
                    "geo_location_check",
                    "user_agent_check",
                    "new_account_check",
                    "no_orders_check"
                ])
            )
        )
        existing = result.scalars().all()
        if existing:
            print("RiskManagement table already seeded.")
            return

        risky_domains = {"tempmail.com", "10minutemail.com", "mailinator.com"}
        high_risk_countries = {"NG", "GH", "PK"}

        items = [
            # Store full values
            RiskManagement(key="risky_domains", value=json.dumps(list(risky_domains)), score=25),
            RiskManagement(key="high_risk_countries", value=json.dumps(list(high_risk_countries)), score=15),

            # Store only key + score
            RiskManagement(key="duplicate_serial_check", score=25),
            RiskManagement(key="repeated_quotes_check", score=15),
            RiskManagement(key="user_agent_potential_bot_check", score=10),
            RiskManagement(key="new_account_check", score=10),
            RiskManagement(key="no_orders_check", score=5),
        ]

        session.add_all(items)
        await session.commit()
        print("Seeded risk_managements table successfully.")

if __name__ == "__main__":
    asyncio.run(seed_risk_management())
