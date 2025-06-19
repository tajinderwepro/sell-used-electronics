from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException,Request
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
from app.schemas.category import CategoryUpdate 
from app.schemas.category import ListResponse
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/add-category")
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    name: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_path = save_upload_file(file)
    app_url = settings.APP_URL
    return await CategoryService.add_category(
            request=request,
            name=name,
            path=f"{app_url}{file_path}",
            db=db,
            current_user=current_user
        )

@router.post("/list", response_model=ListResponse[CategoryOut])
async def get_categories(
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.get_all_categories(
        limit=request.limit,
        offset=request.offset,
        db=db
    )
    
@router.put("/update-category/{category_id}")
async def update_category(
    category_id: int,
    name: str = Form(...),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    image_path = None
    if file:
        image_path = save_upload_file(file)
        image_path = f"{settings.APP_URL}{image_path}"

    return await CategoryService.update_category(
        category_id=category_id,
        name=name,
        image_path=image_path,
        db=db
    )


@router.delete("/delete-category/{category_id}")
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.delete_category(category_id, db)

@router.get("/category/{category_id}")
async def get_category_by_id(
    category_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.get_category_by_id(category_id, db)