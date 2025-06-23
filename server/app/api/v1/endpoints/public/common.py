
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException,Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.category import CategoryOut,ModelListRequest
from app.services.category_service import CategoryService
from typing import List,Optional
from app.core.config import settings  
from app.schemas.category import CategoryUpdate 
from app.schemas.category import ListResponse
from app.core.security import require_roles
from app.schemas.device import DeviceListResponse, DeviceCreate,DeviceSubmitResponse
from app.schemas.quote import QuoteCreate
from app.services.device_service import DeviceService
from app.services.quote_service import QuoteService
from app.core.security import require_roles
import shutil
import os
import uuid
import json 
from app.utils.file_utils import save_upload_file
from app.services.risk_detection_service import RiskDetectionService
from app.services.ebay_service import EbayService
import base64
from sqlalchemy.future import select
from app.models.model import Model

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post(
    "/devices/submit/{user_id}",
    dependencies=[Depends(require_roles(["admin", "user"]))]
)
async def create_device(
    user_id: int,
    category: str = Form(...),
    brand: str = Form(...),
    model: str = Form(...),
    condition: str = Form(...),
    base_price: float = Form(...),
    ebay_avg_price: float = Form(...),
    imei: str = Form(...),
    specifications: str = Form(...),
    files: list[UploadFile] = File(...),
    request: Request = None, 
    db: AsyncSession = Depends(get_db),
):
    image_urls = []
    for file in files:
        path = save_upload_file(file)
        image_urls.append(f"{settings.APP_URL}{path}")

    # ✅ Convert specifications to dict
    try:
        spec_data = json.loads(specifications) if specifications else None
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid specifications format. Must be JSON.")

    payload = QuoteCreate(
        category=category,
        brand=brand,
        model=model,
        condition=condition,
        offered_price=base_price,
        ebay_avg_price=ebay_avg_price,
        imei=imei,
        specifications=spec_data,
    )

    return await QuoteService.submit_quote(
        user_id=user_id,
        quote_in=payload,
        image_urls=image_urls,
        db=db,
        request=request  
    )


@router.post("/category/list", response_model=ListResponse[CategoryOut])
async def get_categories(
    request: ModelListRequest,
    db: AsyncSession = Depends(get_db)
):
    return await CategoryService.get_all_categories(
        limit=request.limit,
        offset=request.offset,
        db=db
    )

@router.post("/estimate-price")
async def estimate_price(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    base_price = data.get("base_price")
    model_id = int(data.get("model_id"))
    model_result = await db.execute(select(Model).where(Model.id == model_id))
    model_obj = model_result.scalar_one_or_none()
    model_name = None
    if model_obj:
                model_name = model_obj.name
    else:
        raise HTTPException(status_code=400, detail="Model not found")

    ebayService = EbayService(db=db, sandbox=True)
    estimated_price = await ebayService.get_estimated_price(model_name)
    if estimated_price is None:
        estimated_price = base_price - ((base_price * 10) / 100)
    return {"estimated_price": estimated_price, "model_name": model_name}

@router.get("/devices/{id}",dependencies=[Depends(require_roles(["admin","user"]))])
async def getDevice(id: int, db: AsyncSession = Depends(get_db)):
    return await DeviceService.get_device(id , db)
