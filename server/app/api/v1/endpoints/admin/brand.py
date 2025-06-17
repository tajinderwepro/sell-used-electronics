from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.brand import BrandCreate, BrandOut,ModelListRequest
from app.services.brand_service import BrandService
from app.utils.file_utils import save_upload_file
from typing import List
import shutil
import os
import uuid
from app.core.config import settings 
from app.schemas.brand import ListResponse


router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/add-brand/{category_id}")
async def upload_image(
    category_id: int,
    file: UploadFile = File(...),
    name: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    file_path = save_upload_file(file)
    app_url = settings.APP_URL
    return await BrandService.add_brand(category_id, name, f"{app_url}{file_path}", db)

@router.post("/list/{category_id}", response_model=ListResponse[BrandOut])
async def get_brands(
    category_id: int,
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await BrandService.get_all_brands(
        category_id=category_id,
        limit=request.limit,
        offset=request.offset,
        flag=True,
        db=db
    )

@router.post("/all-list/{category_id}", response_model=ListResponse[BrandOut])
async def get_brands(
    category_id: int,
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await BrandService.get_all_brands(
        category_id=category_id,
        limit=request.limit,
        offset=request.offset,
        flag=False,
        db=db
    )

@router.put("/update-brand/{brand_id}")
async def update_brand(
    brand_id: int,
    name: str = Form(...),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    image_path = None
    if file:
        image_path = save_upload_file(file)
        image_path = f"{settings.APP_URL}{image_path}"

    return await BrandService.update_brand(brand_id, name, image_path, db)

@router.delete("/delete-brand/{brand_id}")
async def delete_brand(
    brand_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await BrandService.delete_brand(brand_id, db)
