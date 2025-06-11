from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.brand import Brand
from app.models.media import Media  # Make sure to import Media
from fastapi import HTTPException
from sqlalchemy.orm import selectinload
from typing import List
from app.schemas.brand import BrandCreate, BrandUpdate, BrandOut

class BrandService:
    @staticmethod
    async def add_brand(category_id: int, name: str, path: str, db: AsyncSession):
        try:
            # Check if brand exists
            result = await db.execute(select(Brand).where(Brand.name == name))
            existing = result.scalar_one_or_none()

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Brand already exists"
                )

            # Create new brand
            new_brand = Brand(name=name, category_id=category_id)
            db.add(new_brand)
            await db.commit()
            await db.refresh(new_brand)

            # Create media record
            media = Media(
                path=path,
                mediable_type="brand",
                mediable_id=new_brand.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(new_brand)

            return {
                "success": True,
                "message": "Brand added",
                "brand_id": new_brand.id,
                "media_id": media.id
            }

        except HTTPException:
            raise  # Re-raise HTTPException as is
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error creating brand: {str(e)}"
            )

    @staticmethod
    async def get_all_brands(category_id: int, db: AsyncSession) -> List[BrandOut]:
        result = await db.execute(
            select(Brand)
            .where(Brand.category_id == category_id)
            .options(
                selectinload(Brand.category),
                selectinload(Brand.models),  # If you need models
                selectinload(Brand.media),
            )
        )
        brands = result.scalars().all()
        return brands