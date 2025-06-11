from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from typing import List

from app.models.brand import Brand
from app.models.media import Media
from app.schemas.brand import BrandCreate, BrandOut, BrandUpdate


class BrandService:
    @staticmethod
    async def add_brand(category_id: int, name: str, path: str, db: AsyncSession):
        try:
            result = await db.execute(
                select(Brand).where(
                    Brand.name == name,
                    Brand.category_id == category_id
                )
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise HTTPException(status_code=400, message="Brand already exists")

            new_brand = Brand(name=name, category_id=category_id)
            db.add(new_brand)
            await db.commit()
            await db.refresh(new_brand)

            media = Media(
                path=path,
                mediable_type="brand",
                mediable_id=new_brand.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

            new_brand.media_id = media.id
            await db.commit()
            await db.refresh(new_brand)

            return {
                "success": True,
                "message": "Brand added successfully",
                "brand_id": new_brand.id,
                "media_id": media.id
            }

        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating brand: {str(e)}")

    @staticmethod
    async def get_all_brands(category_id: int, limit: int, offset: int, db: AsyncSession) -> List[BrandOut]:
        result = await db.execute(
            select(Brand)
            .where(Brand.category_id == category_id)
            .options(
                selectinload(Brand.category),
                selectinload(Brand.models),
                selectinload(Brand.media),
            )
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()

    @staticmethod
    async def update_brand(brand_id: int, name: str, image_path: str, db: AsyncSession):
        result = await db.execute(select(Brand).where(Brand.id == brand_id))
        brand = result.scalar_one_or_none()

        if not brand:
            raise HTTPException(status_code=404, message="Brand not found")

        if name:
            brand.name = name

        if image_path:
            media = Media(
                path=image_path,
                mediable_type="brand",
                mediable_id=brand_id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)
            brand.media_id = media.id

        await db.commit()
        await db.refresh(brand)

        return {"success": True, "message": "Brand updated successfully", "brand_id": brand.id}

    @staticmethod
    async def delete_brand(brand_id: int, db: AsyncSession):
        result = await db.execute(select(Brand).where(Brand.id == brand_id))
        brand = result.scalar_one_or_none()

        if not brand:
            raise HTTPException(status_code=404, message="Brand not found")

        await db.delete(brand)
        await db.commit()

        return {"success": True, "message": "Brand deleted successfully"}
