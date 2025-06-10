from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.category import Category
from app.models.media import Media

class CategoryService:
    @staticmethod
    async def add_category(name: str, path: str, db: AsyncSession):
        try:
            # Check if the category already exists
            result = await db.execute(select(Category).where(Category.name == name))
            existing = result.scalar_one_or_none()
            if existing:
                return {"success": False, "message": "Category already exists"}

            # Create new category
            new_category = Category(name=name)
            db.add(new_category)
            await db.commit()
            await db.refresh(new_category)

            # Create media
            media = Media(
                path=path,
                mediable_type="category",
                mediable_id=new_category.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

            # Link media to category
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
    async def get_all_categories(db: AsyncSession):
        result = await db.execute(
            select(Category)
            .options(
                selectinload(Category.brands),
                selectinload(Category.models),
                selectinload(Category.media) 
                 
            )
        )
        return result.scalars().all()
