from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.brand import Brand
from app.schemas.brand import BrandCreate
from sqlalchemy.orm import selectinload
from typing import List

class BrandService:
    @staticmethod
    async def add_brand(category_id, name: str, path: str, db: AsyncSession):
        result = await db.execute(select(Brand).where(Brand.name == name))
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Brand already exists"}
            new_brand = Brand(name=name, category_id = category_id)
            db.add(new_brand)
            await db.commit()
            await db.refresh(new_brand)

        # Create media
            media = Media(
                path=path,
                mediable_type="brand",
                mediable_id=new_brand.id
            )
        await db.commit()
        await db.refresh(new_brand)

        return {"success": True, "message": "Brand added", "brand_id": new_brand.id}

    @staticmethod
    async def get_all_brands(category_id: int, db: AsyncSession):
        """
        Retrieves all brands from the database for a specific category.

        Args:
            category_id (int): The ID of the category.
            db (AsyncSession): The database session.

        Returns:
            List[dict]: A list of dictionaries representing the brands.
        """
        try:
            result = await db.execute(
                select(Brand)
                .where(Brand.category_id == category_id)  # Filter by category_id
                .options(
                    selectinload(Brand.category),
                    selectinload(Brand.models),
                    selectinload(Brand.media)
                )
            )
            brands = result.scalars().all()

            # Transform the Brand objects into dictionaries
            brand_list = []
            for brand in brands:
                media_list = []
                if brand.media:
                    for media in brand.media:
                        media_list.append({
                            "id": media.id,
                            "url": media.url,  # Assuming you have a url field
                            "mediable_type": media.mediable_type,
                        })

                brand_list.append({
                    "id": brand.id,
                    "name": brand.name,
                    "media_id": brand.media_id,
                    "category_id": brand.category_id,
                    "category": {
                        "id": brand.category.id,
                        "name": brand.category.name  # Assuming category has an id and name
                    } if brand.category else None,
                    "models": brand.models,  # Assuming models is a list or similar
                    "media": media_list
                })

            return brand_list

        except Exception as e:
            # Log the error for debugging purposes
            print(f"Error in get_all_brands: {e}")
            raise  # Re-raise the exception to be handled by the API endpoint
