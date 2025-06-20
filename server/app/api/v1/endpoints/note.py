from fastapi import APIRouter, HTTPException, Request, Depends
from typing import Literal, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.shipping_service import ShippingService
from app.services.note_service import NoteService 
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.order import Order  
from app.models.quote import Quote  
from app.models.user import User
from app.schemas.note import NoteCreate, NoteOut

router = APIRouter()

@router.post("/add", response_model=NoteOut)
async def create_note(
    note_data: NoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await NoteService.create_note(db=db, note_data=note_data, current_user=current_user)


@router.get("/list", response_model=List[NoteOut])
async def get_notes_list(
    db: AsyncSession = Depends(get_db)
):
    return await NoteService.get_notes_list(db=db)


@router.get("/{note_id}", response_model=NoteOut)
async def get_note_by_id(
    note_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await NoteService.get_note_by_id(db=db, note_id=note_id)
