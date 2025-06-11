from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.model import ModelCreate, ModelOut,ModelListRequest
from app.services.model_service import ModelService
from app.utils.file_utils import save_upload_file
from typing import List
import os
from app.core.config import settings

router = APIRouter()
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/add-model/{brand_id}")
async def upload_model(
    brand_id: int,
    file: UploadFile = File(...),
    name: str = Form(...),
    # base_price: float = Form(...), 
    media_id: int = Form(None),
    category_id: int = Form(...),
    db: AsyncSession = Depends(get_db)
):
    file_path = save_upload_file(file)
    app_url = settings.APP_URL

    payload = ModelCreate(
        name=name,
        media_id=media_id,
        brand_id=brand_id,
        category_id=category_id,
        # base_price=base_price  
    )
    return await ModelService.add_model(brand_id, payload, f"{app_url}{file_path}", db)



@router.post("/list/{brand_id}", response_model=List[ModelOut])
async def list_models(
    brand_id: int,
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await ModelService.get_all_models(
        brand_id=brand_id,
        limit=request.limit,
        offset=request.offset,
        db=db
    )

