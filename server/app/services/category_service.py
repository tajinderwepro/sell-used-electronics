from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload

from app.models.category import Category
from app.models.media import Media
from app.models.brand import Brand
from app.models.model import Model
from app.models.log import Log
from app.schemas.category import CategoryOut
from app.schemas.category import ListResponse
from sqlalchemy import and_
from app.services.system_info_service import SystemInfoService


class CategoryService:

    @staticmethod
    async def add_category(request,name: str, path: str, db: AsyncSession,current_user):
        try:
            # Check if the category already exists
            system_info = SystemInfoService(request)
            os = system_info.get_os()
            ip_address = request.client.host
            browser = system_info.get_browser()

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
            # logs storing
            logs = Log(
                user_id=current_user.id,
                action="Add Category",
                description=f"user : {current_user.name.capitalize()}({current_user.role}) added a category",
                ip_address=ip_address,
                os=os,
                browser=browser
            )
            db.add(logs)
            await db.commit()
            await db.refresh(logs)
            
            return {
                "success": True,
                "message": "Category added successfully",
                "category_id": new_category.id
            }

        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to add category: {str(e)}")

    @staticmethod
    async def get_all_categories( limit: int,offset: int, flag: bool = True, db: AsyncSession = None) -> ListResponse[CategoryOut]:
        if flag:
            result = await db.execute(
                select(Category)
                .options(
                    selectinload(Category.media),
                    selectinload(Category.brands),
                    selectinload(Category.models)
                )
                .order_by(Category.id)
                .limit(limit)
                .offset(offset)
            )
        else:
            result = await db.execute(
                select(Category)
                .options(
                    selectinload(Category.media),
                    selectinload(Category.brands),
                    selectinload(Category.models)
                )
            )

        categories = result.scalars().all()

        return ListResponse[CategoryOut](
            success=True,
            status_code=200,
            data=[CategoryOut.from_orm(cat) for cat in categories]
        )

    @staticmethod
    async def update_category(category_id: int, name: str, image_path: str, db: AsyncSession):
        result = await db.execute(select(Category).where(Category.id == category_id))
        category = result.scalar_one_or_none()
        res = await db.execute(
            select(Category).where(
                and_(Category.name == name, Category.id != category_id)
            )
        )
        existing = res.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Category already exists"}


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