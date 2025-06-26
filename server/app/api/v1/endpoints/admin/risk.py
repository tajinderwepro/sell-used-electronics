# app/routes/auth_routes.py

from fastapi import APIRouter, Depends, Query, HTTPException, status, Request, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.risk_management_service import RiskManagementService
from app.schemas.risk_management import RiskManagementCreate, RiskManagementUpdate

router = APIRouter()

@router.get("/list")
async def get_list(db: AsyncSession = Depends(get_db)):
    return await RiskManagementService.get_list(db)

@router.get("/{id}")
async def get_by_id(id: int, db: AsyncSession = Depends(get_db)):
    return await RiskManagementService.get_by_id(id, db)

@router.post("/")
async def create(data: RiskManagementCreate, db: AsyncSession = Depends(get_db)):
    return await RiskManagementService.create(data, db)

@router.put("/{id}")
async def update(id: int, data: RiskManagementUpdate, db: AsyncSession = Depends(get_db)):
    return await RiskManagementService.update(id, data, db) 



@router.delete("/{id}")
async def delete(id: int, db: AsyncSession = Depends(get_db)):
    return await RiskManagementService.delete(id, db)
