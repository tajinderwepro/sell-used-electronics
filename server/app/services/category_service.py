from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.category import Category
from app.models.media import Media
from sqlalchemy.orm import selectinload
from app.models.brand import Brand
from app.models.model import Model
from sqlalchemy import delete, update

class CategoryService:
    @staticmethod
    async def add_category(name: str, path: str, db: AsyncSession):
        try:
            # Check if the category already exists
            result = await db.execute(select(Category).where(Category.name == name))
            existing = result.scalar_one_or_none()
            if existing:
                return {"success": False, "message": "Category already exists"}

            new_category = Category(name=name)
            db.add(new_category)
            await db.commit()
            await db.refresh(new_category)

            media = Media(
                path=path,
                mediable_type="category",
                mediable_id=new_category.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

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

        try:
            # Check for existing category
            result = await db.execute(select(Category).where(Category.name == payload.name))
            existing = result.scalar_one_or_none()
            if existing:
                return {"success": False, "message": "Category already exists"}

            # Step 1: Create the category
            new_category = Category(name=payload.name)
            db.add(new_category)
            await db.commit()
            await db.refresh(new_category)

            # Step 3: Store media record
            media = Media(
                path=path,
                mediable_type="category",
                mediable_id=new_category.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

            # Step 4: Update category with media_id
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
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
    @staticmethod
    async def update_category(category_id: int, name: str, image_path: str, db: AsyncSession):
        result = await db.execute(select(Category).where(Category.id == category_id))
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        category.name = name

        if image_path:
            media_entry = Media(
                path=image_path,
                mediable_id=category_id,
                mediable_type='category'
            )
            db.add(media_entry)

        await db.commit()
        await db.refresh(category)
        return {"message": "Category updated successfully"}

    @staticmethod
    async def delete_category(category_id: int, db: AsyncSession):
        result = await db.execute(select(Category).where(Category.id == category_id))
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        await db.delete(category)
        await db.commit()
        return {"message": "Category deleted successfully"}
