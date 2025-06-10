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

    # @staticmethod
    # async def get_all_brands(category_id: int, db: AsyncSession):

    #     """
    #     Retrieves all brands from the database for a specific category.

    #     Args:
    #         category_id (int): The ID of the category.
    #         db (AsyncSession): The database session.

    #     Returns:
    #         List[dict]: A list of dictionaries representing the brands.
    #     """
    #     try:
    #         result = await db.execute(
    #             select(Brand)
    #             .where(Brand.category_id == category_id)  # Filter by category_id
    #             .options(
    #                 selectinload(Brand.category),
    #                 selectinload(Brand.models),
    #                 selectinload(Brand.media)
    #             )
    #         )
    #         brands = result.scalars().all()

    #         # Transform the Brand objects into dictionaries
    #         brand_list = []
    #         for brand in brands:
    #             media_list = []
    #             if brand.media:
    #                 for media in brand.media:
    #                     media_list.append({
    #                         "id": media.id,
                            
    #                         # "url": media.url,  # Assuming you have a url field
    #                         "mediable_type": media.mediable_type,
    #                     })

    #             brand_list.append({
    #                 "id": brand.id,
    #                 "name": brand.name,
    #                 "media_id": brand.media_id,
    #                 "category_id": brand.category_id,
    #                 "category": {
    #                     "id": brand.category.id,
    #                     "name": brand.category.name  # Assuming category has an id and name
    #                 } if brand.category else None,
    #                 "models": brand.models,  # Assuming models is a list or similar
    #                 "media": media_list
    #             })

    #         return brand_list

    #     except Exception as e:
    #         # Log the error for debugging purposes
    #         print(f"Error in get_all_brands: {e}")
    #         raise  # Re-raise the exception to be handled by the API endpoint

    @staticmethod
    async def get_all_brands(category_id: int, db: AsyncSession) -> List[BrandOut]:
        result = await db.execute(
            select(Brand)
            .where(Brand.category_id == category_id)
            .options(
                selectinload(Brand.media),
                selectinload(Brand.models)  # If you need models
            )
        )
        brands = result.scalars().all()
        return brands