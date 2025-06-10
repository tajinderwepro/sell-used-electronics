from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.model import Model
from app.schemas.model import ModelCreate
from typing import List

class ModelService:
    @staticmethod
    async def add_model(payload: ModelCreate, db: AsyncSession):
        result = await db.execute(
            select(Model).where(
                Model.name == payload.name,
                Model.brand_id == payload.brand_id,
                Model.category_id == payload.category_id
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Model already exists"}

        new_model = Model(
            name=payload.name,
            media_id=payload.media_id,
            brand_id=payload.brand_id,
            category_id=payload.category_id
        )
        db.add(new_model)
        await db.commit()
        await db.refresh(new_model)

        return {"success": True, "message": "Model added", "model_id": new_model.id}

    @staticmethod
    async def get_all_models(db: AsyncSession) -> List[Model]:
        result = await db.execute(select(Model))
        return result.scalars().all()
