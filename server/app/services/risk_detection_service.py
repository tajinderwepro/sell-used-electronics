import json
from collections import Counter
from typing import List, Dict
from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.quote_history import QuoteHistory
from app.models.user import User
from app.models.risk_management import RiskManagement  
import httpx


class RiskDetectionService:
    def __init__(self, user_id: int, model_id: str, request: Request, db: AsyncSession):
        self.user_id = user_id
        self.model_id = model_id
        self.request = request
        self.db = db

        self.user_email = ""
        self.quote_history = []
        self.user_ip = self.get_client_ip()
        self.user_agent = self.get_user_agent()
        self.geo_location = {}
        self.account_age_days = 0
        self.num_previous_orders = 0

        self.risky_domains = set()
        self.high_risk_countries = set()

    def get_client_ip(self) -> str:
        forwarded = self.request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return self.request.client.host

    def get_user_agent(self) -> str:
        return self.request.headers.get("User-Agent", "")

    async def preload_data(self):
        # Load user email
        result = await self.db.execute(select(User.email).where(User.id == self.user_id))
        self.user_email = result.scalar_one_or_none() or ""

        # Load quote history
        result = await self.db.execute(
            select(QuoteHistory.model_id).where(QuoteHistory.user_id == self.user_id)
        )
        self.quote_history = [{"model_id": row[0]} for row in result.all()]

        # Load geo location
        self.geo_location = await self.get_geo_location(self.user_ip)

        # ✅ Load risk settings dynamically
        result = await self.db.execute(
            select(RiskManagement).where(RiskManagement.key.in_(["risky_domains", "high_risk_countries"]))
        )
        records = result.scalars().all()

        for item in records:
            if item.key == "risky_domains":
                self.risky_domains = set(json.loads(item.value))
            elif item.key == "high_risk_countries":
                self.high_risk_countries = set(json.loads(item.value))

    async def get_geo_location(self, ip: str) -> dict:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"https://ipapi.co/{ip}/json/")
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "country": data.get("country"),
                        "region": data.get("region"),
                        "city": data.get("city"),
                        "org": data.get("org")
                    }
        except Exception as e:
            print(f"Geo lookup failed: {e}")
        return {"country": "UNKNOWN"}

    async def calculate_risk_score(self) -> int:
        await self.preload_data()
        score = 0

        domain = self.user_email.split("@")[-1]
        if domain in self.risky_domains:
            score += 25

        device_counts = Counter([h["model_id"] for h in self.quote_history])
        if device_counts.get(self.model_id, 0) > 2:
            score += 15

        country = self.geo_location.get("country")
        if country in self.high_risk_countries:
            score += 15

        if "python" in self.user_agent.lower() or "curl" in self.user_agent.lower():
            score += 10

        if self.account_age_days < 7:
            score += 10

        if self.num_previous_orders == 0:
            score += 5

        return min(score, 100)
