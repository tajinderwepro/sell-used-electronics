from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.brand import BrandCreate, BrandOut
from app.services.brand_service import BrandService
from typing import List

router = APIRouter()

@router.post("/add-brand")
async def add_brand(payload: BrandCreate, db: AsyncSession = Depends(get_db)):
    return await BrandService.add_brand(payload, db)

@router.get("/list", response_model=List[BrandOut])
async def get_brands(db: AsyncSession = Depends(get_db)):
    return await BrandService.get_all_brands(db)
