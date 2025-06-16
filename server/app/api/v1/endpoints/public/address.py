from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.address import AddressCreate, AddressOut, AddressResponse
from app.services.address_service import AddressService

router = APIRouter()

@router.post("/{user_id}", response_model=AddressResponse)
async def create_address(address: AddressCreate, user_id: int, db: AsyncSession = Depends(get_db)):
    return await AddressService.add_address(data=address, user_id=user_id, db=db)

@router.get("/{user_id}")
async def get_address(user_id: int, db: AsyncSession = Depends(get_db)):
    return await AddressService.get_address_by_id(user_id=user_id)
