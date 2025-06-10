from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.brand import Brand
from app.schemas.brand import BrandCreate
from sqlalchemy.orm import selectinload
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
    async def get_all_brands(db: AsyncSession):
        result = await db.execute(
            select(Brand)
            .options(
                selectinload(Brand.category),
                selectinload(Brand.models),
                selectinload(Brand.media)
            )
        )
        brands = result.scalars().all()
        return [
            {
                "id": brand.id,
                "name": brand.name,
                "media_id": brand.media_id,
                "category_id": brand.category_id,
                "category": brand.category,
                "models": brand.models,
                "media": [
                    {
                        "id": media.id,
                        # Include only non-binary fields from Media
                        "url": media.url,  # assuming you have a url field
                        "mediable_type": media.mediable_type,
                        # Exclude any binary data fields
                    }
                    for media in brand.media
                ] if brand.media else []
            }
            for brand in brands
        ]