from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.models.media import Media
from app.models.brand import Brand
from app.models.model import Model


class CategoryService:
    @staticmethod
    async def add_category(name: str, path: str, db: AsyncSession):
        try:
            # Check if the category already exists
            result = await db.execute(select(Category).where(Category.name == name))
            existing = result.scalar_one_or_none()
            if existing:
                return {"success": False, "message": "Category already exists"}

            # Create the category
            new_category = Category(name=name)
            db.add(new_category)
            await db.commit()
            await db.refresh(new_category)

            # Add media entry
            media = Media(
                path=path,
                mediable_type="category",
                mediable_id=new_category.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

            # Update category with media_id
            new_category.media_id = media.id
            await db.commit()
            await db.refresh(new_category)

            return {
                "success": True,
                "message": "Category added successfully",
                "category_id": new_category.id
            }

        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to add category: {str(e)}")

    @staticmethod
    async def get_all_categories(limit: int, offset: int, db: AsyncSession):
        result = await db.execute(
            select(Category)
            .options(
                selectinload(Category.media),
                selectinload(Category.models).selectinload(Model.media),
                selectinload(Category.brands)
                    .selectinload(Brand.models)
                    .selectinload(Model.media),
                selectinload(Category.brands).selectinload(Brand.media)
            )
            .order_by(Category.id)
            .limit(limit)
            .offset(offset)
        )

        categories = result.scalars().all()

        return {
            "success": True,
            "status_code": 200,
            "data": categories
        }


    @staticmethod
    async def update_category(category_id: int, name: str, image_path: str, db: AsyncSession):
        result = await db.execute(select(Category).where(Category.id == category_id))
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        category.name = name

        if image_path:
            # Check if media already exists for this category
            media_result = await db.execute(
                select(Media).where(
                    Media.id == category.media_id,
                )
            )
            media = media_result.scalar_one_or_none()

            if media:
                media.path = image_path  # Update existing media path
            else:
                # Create new media
                media = Media(
                    path=image_path,
                    mediable_type='category',
                    mediable_id=category_id
                )
                db.add(media)
                await db.flush()  # Ensure media.id is available
                category.media_id = media.id  # Update category media_id

        await db.commit()
        await db.refresh(category)

        return {
            "success": True,
            "status_code": 200,
            "message": "Category updated successfully"
        }

    @staticmethod
    async def delete_category(category_id: int, db: AsyncSession):
        result = await db.execute(select(Category).where(Category.id == category_id))
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        await db.delete(category)
        await db.commit()
        return {
            "success": True,
            "status_code": 200,
            "message": "Category deleted successfully"
        }


    @staticmethod
    async def get_category_by_id(category_id: int, db: AsyncSession):
        result = await db.execute(
            select(Category)
            .where(Category.id == category_id)
            .options(
                selectinload(Category.media),
                selectinload(Category.brands).selectinload(Brand.media),
                selectinload(Category.models).selectinload(Model.media)
            )
        )
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        return category