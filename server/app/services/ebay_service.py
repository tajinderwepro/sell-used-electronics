import requests
from statistics import mean
# from app.ebay.auth import get_ebay_access_token
from typing import Optional
import logging

class EbayService:
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = self.get_access_token()

    def get_access_token(self) -> str:
        url = "https://api.ebay.com/identity/v1/oauth2/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Basic {self._encode_credentials()}"
        }
        data = {
            "grant_type": "client_credentials",
            "scope": "https://api.ebay.com/oauth/api_scope"
        }

        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()["access_token"]
    def get_estimated_price(self, query: str) -> Optional[float]:
        url = f"https://api.ebay.com/buy/browse/v1/item_summary/search?q={query}&limit=10"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            logging.error(f"eBay API error: {response.status_code}, {response.text}")
            return None

        items = response.json().get("itemSummaries", [])
        prices = []

        for item in items:
            try:
                price = float(item["price"]["value"])
                prices.append(price)
            except (KeyError, ValueError):
                continue

        if not prices:
            return None

        estimated_price = sum(prices) / len(prices)
        return round(estimated_price, 2)
