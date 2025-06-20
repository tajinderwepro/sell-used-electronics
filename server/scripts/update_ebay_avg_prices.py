import sys
import os
import asyncio
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import async_session
from app.models.model import Model
from app.services.ebay_service import EbayService
from app.core.config import settings

CONDITIONS = ["Used", "Seller refurbished", "For parts or not working", "Manufacturer refurbished", "New other (see details)", "New"]

async def update_prices():
    async with async_session() as session:
        result = await session.execute(select(Model))
        models = result.scalars().all()

        ebay_service = EbayService(db=session, sandbox=True)  # Set to False for production
        any_updated = False

        for model in models:
            if not model.name:
                continue

            try:
                price_by_condition = {}

                for condition in CONDITIONS:
                    price = await ebay_service.get_estimated_price(model.name, condition=condition)
                    if price:
                        price_by_condition[condition] = price
                        print(f"✅ {model.name} ({condition}) → {price}")
                    else:
                        print(f"⚠️ {model.name} ({condition}) → Price not found")

                if price_by_condition:
                    try:
                        current_spec = json.loads(model.specifications or "{}")
                        if not isinstance(current_spec, dict):
                            current_spec = {}
                    except json.JSONDecodeError:
                        current_spec = {}

                    current_spec["price_by_condition"] = price_by_condition
                    model.specifications = json.dumps(current_spec)
                    any_updated = True

            except Exception as e:
                print(f"❌ Error processing {model.name}: {e}")
                continue

        if any_updated:
            await session.commit()
            print("✅ All updates committed.")
        else:
            print("ℹ️ No updates made.")

if __name__ == "__main__":
    asyncio.run(update_prices())
