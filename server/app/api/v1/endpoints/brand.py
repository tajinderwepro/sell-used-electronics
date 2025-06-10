from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.brand import BrandCreate, BrandOut
from app.services.brand_service import BrandService
from app.utils.file_utils import save_upload_file
from typing import List
import shutil
import os
import uuid
from app.core.config import settings 

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

@router.get("/list/{category_id}", response_model=List[BrandOut])
async def get_brands(category_id: int, db: AsyncSession = Depends(get_db)):
    return await BrandService.get_all_brands(category_id, db)
