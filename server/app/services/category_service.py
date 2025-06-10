from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.category import Category
from app.schemas.category import CategoryCreate
from sqlalchemy.orm import selectinload
from typing import List

class CategoryService:

    @staticmethod
    async def add_category(payload: CategoryCreate, db: AsyncSession):
        # Check if category with same name exists
        result = await db.execute(select(Category).where(Category.name == payload.name))
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Category already exists"}

        new = Category(
            name=payload.name,
            media_id=payload.media_id
        )
        db.add(new)
        await db.commit()
        await db.refresh(new)

        return {"success": True, "message": "Category added", "category_id": new.id}

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
