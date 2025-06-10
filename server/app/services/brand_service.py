from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.brand import Brand
from app.schemas.brand import BrandCreate
from typing import List

class BrandService:
    @staticmethod
    async def add_brand(payload: BrandCreate, db: AsyncSession):
        result = await db.execute(select(Brand).where(Brand.name == payload.name, Brand.category_id == payload.category_id))
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Brand already exists"}

        new_brand = Brand(
            name=payload.name,
            media_id=payload.media_id,
            category_id=payload.category_id
        )
        db.add(new_brand)
        await db.commit()
        await db.refresh(new_brand)

        return {"success": True, "message": "Brand added", "brand_id": new_brand.id}

    @staticmethod
    async def get_all_brands(db: AsyncSession) -> List[Brand]:
        result = await db.execute(select(Brand))
        return result.scalars().all()
