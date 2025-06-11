from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.model import Model
from app.models.media import Media
from fastapi import HTTPException
from typing import List
from app.schemas.model import ModelCreate, ModelOut
from sqlalchemy.orm import selectinload


class ModelService:
    @staticmethod
    async def add_model(brand_id: int, payload: ModelCreate, path: str, db: AsyncSession):
        try:
            # Check if model with same name exists under same brand and category
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

            # Create new model
            new_model = Model(
                name=payload.name,
                media_id=payload.media_id,
                brand_id=brand_id,
                category_id=payload.category_id
            )
            db.add(new_model)
            await db.commit()
            await db.refresh(new_model)

            # Create media
            media = Media(
                path=path,
                mediable_type="model",
                mediable_id=new_model.id
            )
            db.add(media)
            await db.commit()

            return {
                "success": True,
                "message": "Model added",
                "model_id": new_model.id,
                "media_id": media.id
            }

        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error creating model: {str(e)}")

    @staticmethod
    async def get_all_models(brand_id: int, db: AsyncSession) -> List[ModelOut]:
        result = await db.execute(
            select(Model)
            .where(Model.brand_id == brand_id)
            .options(
                selectinload(Model.brand),
                selectinload(Model.category),
                selectinload(Model.media)
            )
        )
        return result.scalars().all()
