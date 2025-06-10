from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.model import ModelCreate, ModelOut
from app.services.model_service import ModelService
from typing import List

router = APIRouter()

@router.post("/add-model")
async def add_model(payload: ModelCreate, db: AsyncSession = Depends(get_db)):
    return await ModelService.add_model(payload, db)

@router.get("/models", response_model=List[ModelOut])
async def get_models(db: AsyncSession = Depends(get_db)):
    return await ModelService.get_all_models(db)
