from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import NoResultFound
from fastapi import HTTPException, status
from typing import List

from app.models.model import Model
from app.models.media import Media
from app.schemas.model import ModelCreate, ModelOut, ModelUpdate,ListResponse


class ModelService:
    @staticmethod
    async def add_model(brand_id: int, payload: ModelCreate, path: str, db: AsyncSession):
        try:
            result = await db.execute(
                select(Model).where(
                    Model.name == payload.name,
                    Model.brand_id == brand_id,
                    Model.category_id == payload.category_id
                )
            )
            existing = result.scalar_one_or_none()
            if existing:
                raise HTTPException(status_code=400, detail="Model already exists")

            # 1. Create model without media_id
            new_model = Model(
                name=payload.name,
                brand_id=brand_id,
                category_id=payload.category_id
            )
            db.add(new_model)
            await db.commit()
            await db.refresh(new_model)

            # 2. Create media linked to model
            media = Media(
                path=path,
                mediable_type="model",
                mediable_id=new_model.id
            )
            db.add(media)
            await db.commit()
            await db.refresh(media)

            # 3. Update model with media_id
            new_model.media_id = media.id
            await db.commit()
            await db.refresh(new_model)

            return {
                "success": True,
                "message": "Model added successfully",
                "model_id": new_model.id,
                "media_id": media.id
            }

        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating model: {str(e)}")

    @staticmethod
    async def get_all_models(brand_id: int, limit: int, offset: int, db: AsyncSession):
        total_result = await db.execute(
            select(Model).where(Model.brand_id == brand_id)
        )
        total_count = len(total_result.scalars().all())

        result = await db.execute(
            select(Model)
            .where(Model.brand_id == brand_id)
            .options(
                selectinload(Model.brand),
                selectinload(Model.category),
                selectinload(Model.media)
            )
            .limit(limit)
            .offset(offset)
        )
        models = result.scalars().all()

        return ListResponse[ModelOut](
            success=True,
            status_code=200,
            data=[ModelOut.from_orm(model) for model in models]
        )


    @staticmethod
    async def update_model(model_id: int, name: str, image_path: str, db: AsyncSession):
        result = await db.execute(select(Model).where(Model.id == model_id))
        model = result.scalar_one_or_none()

        if not model:
            return {"success": False, "message": "Model already exist"}

        model.name = name

        if image_path:
            # Look for existing media for this model with type 'model'
            media_result = await db.execute(
                select(Media).where(
                    Media.id == model.media_id,
                )
            )
            media = media_result.scalar_one_or_none()

            if media:
                # Update existing media path
                media.path = image_path
            else:
                # Create new media if none found
                media = Media(
                    path=image_path,
                    mediable_type='model',
                    mediable_id=model_id
                )
                db.add(media)

            await db.commit()
            await db.refresh(media)
            model.media_id = media.id  # Ensure model references correct media ID

        await db.commit()
        await db.refresh(model)

        return {
            "success": True,
            "status_code": 200,
            "message": "Model updated successfully",
            "model": model
        }


    @staticmethod
    async def delete_model(model_id: int, db: AsyncSession):
        result = await db.execute(select(Model).where(Model.id == model_id))
        model = result.scalar_one_or_none()

        if not model:
            raise HTTPException(status_code=404, detail="Model not found")

        await db.delete(model)
        await db.commit()
        return {
            "success": True,
            "status_code": 200,
            "message": "Model deleted successfully"
        }
