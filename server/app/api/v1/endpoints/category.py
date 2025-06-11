from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.category import CategoryOut,ModelListRequest
from app.services.category_service import CategoryService
from typing import List
import shutil
import os
import uuid
from app.utils.file_utils import save_upload_file
from app.core.config import settings  

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/add-category")
async def upload_image(
    file: UploadFile = File(...),
    name: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    file_path = save_upload_file(file)
    app_url = settings.APP_URL
    return await CategoryService.add_category(name, f"{app_url}{file_path}", db)

@router.post("/list", response_model=List[CategoryOut])
async def get_categories(
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.get_all_categories(
        limit=request.limit,
        offset=request.offset,
        db=db
    )
