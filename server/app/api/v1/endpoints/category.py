from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.category import CategoryCreate, CategoryOut
from app.services.category_service import CategoryService
from typing import List

router = APIRouter()

@router.post("/add-category", response_model=dict)
async def add_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await CategoryService.add_category(payload, db)

@router.get("/categories", response_model=List[CategoryOut])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await CategoryService.get_all_categories(db)
