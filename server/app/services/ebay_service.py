import requests
import base64
import json
from statistics import mean
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.ebay_tokens import EbayToken
from app.models.log import Log
from app.core.config import settings


class EbayService:
    def __init__(self, db: AsyncSession, sandbox: bool = True):
        self.client_id = settings.EBAY_CLIENT_ID
        self.client_secret = settings.EBAY_CLIENT_SECRET
        self.db = db
        self.env = "sandbox" if sandbox else "production"
        self.base_auth_url = f"https://api.{self.env}.ebay.com"
        self.base_api_url = f"https://api.{self.env}.ebay.com"
        self.scope = "https://api.ebay.com/oauth/api_scope"

    def _encode_credentials(self) -> str:
        credentials = f"{self.client_id.strip()}:{self.client_secret.strip()}"
        return base64.b64encode(credentials.encode()).decode()

    async def _get_token_from_db(self) -> Optional[str]:
        result = await self.db.execute(select(EbayToken).where(EbayToken.environment == self.env))
        token_entry = result.scalars().first()
        if token_entry and token_entry.expires_at > datetime.utcnow():
            return token_entry.access_token
        return None

    async def _save_token_to_db(self, token: str, expires_in: int):
        expires_at = datetime.utcnow() + timedelta(seconds=expires_in - 60)
        result = await self.db.execute(select(EbayToken).where(EbayToken.environment == self.env))
        token_entry = result.scalars().first()

        if token_entry:
            token_entry.access_token = token
            token_entry.expires_at = expires_at
        else:
            token_entry = EbayToken(
                environment=self.env,
                access_token=token,
                expires_at=expires_at
            )
            self.db.add(token_entry)

        await self.db.commit()

    async def get_access_token(self) -> Optional[str]:
        token = await self._get_token_from_db()
        if token:
            return token

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {self._encode_credentials()}",
        }
        data = {
            "grant_type": "client_credentials",
            "scope": self.scope,
        }

        try:
            response = requests.post(
                f"{self.base_auth_url}/identity/v1/oauth2/token",
                headers=headers,
                data=data
            )
            response.raise_for_status()
            res = response.json()
            token = res.get("access_token")
            expires_in = res.get("expires_in", 7200)
            if token:
                await self._save_token_to_db(token, expires_in)
                await self._log_action("token_refresh", "Successfully refreshed eBay access token", json.dumps(res))
                return token
        except requests.RequestException as e:
            await self._log_action("token_refresh_failed", f"Failed to fetch eBay token: {e}")
        return None

    async def get_estimated_price(self, query: str, condition: Optional[str] = None, limit: int = 20) -> Optional[float]:
        return await self._fetch_price(query=query, condition=condition, limit=limit)

    async def _fetch_price(self, query: str, condition: Optional[str] = None, limit: int = 10, retry: bool = True) -> Optional[float]:
        token = await self.get_access_token()
        if not token:
            return None

        url = f"{self.base_api_url}/buy/browse/v1/item_summary/search"
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        }

        filter_clause = ""
        if condition:
            condition_ids = self.get_condition_ids([condition])
            if condition_ids:
                condition_ids_str = ",".join(condition_ids)
                filter_clause = f"conditionIds:{{{condition_ids_str}}}"

        params = {
            "q": query,
            "limit": limit,
        }

        if filter_clause:
            params["filter"] = filter_clause

        try:
            response = requests.get(url, headers=headers, params=params)

            if response.status_code == 401:
                json_resp = response.json()
                if json_resp.get("errors", [{}])[0].get("message") == "Invalid access token" and retry:
                    await self._log_action("token_expired", "Invalid token detected. Retrying after refresh.", json.dumps(json_resp))
                    await self._save_token_to_db("", 0)
                    return await self._fetch_price(query, condition, limit, retry=False)

            response.raise_for_status()

            res_json = response.json()
            items = res_json.get("itemSummaries", [])
            prices = [
                float(item["price"]["value"])
                for item in items
                if "price" in item and "value" in item["price"]
            ]

            avg_price = round(mean(prices), 2) if prices else None
            offer_price = round(avg_price * 0.6, 2) if avg_price else None
            await self._log_action(
                "price_fetched",
                f"Fetched average price for '{query}' ({condition or 'all'}) = {avg_price}, offer = {offer_price}",
                json.dumps(res_json)[:10000]
            )

            return offer_price

        except requests.RequestException as e:
            await self._log_action("price_fetch_failed", f"eBay API error for '{query}': {e}")
            return None

    @staticmethod
    def get_condition_ids(conditions: List[str]) -> List[str]:
        condition_map = {
            "New": "1000",
            "New other (see details)": "1500",
            "Manufacturer refurbished": "2000",
            "Seller refurbished": "2500",
            "Used": "3000",
            "For parts or not working": "7000",
        }
        return [condition_map[c.strip()] for c in conditions if c.strip() in condition_map]

    async def _log_action(self, action: str, description: str, raw_response: Optional[str] = None):
        log = Log(
            action=action,
            description=(description + "\n\n" + raw_response) if raw_response else description,
            ip_address="system",
            os="server",
            browser="script"
        )
        self.db.add(log)
        await self.db.commit()
