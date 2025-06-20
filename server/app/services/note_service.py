
from fastapi import HTTPException
from app.models.order import Order
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.quote import Quote
from typing import Optional
from app.utils.db_helpers import paginate_query
from app.models.note import Note    
from app.core.security import get_current_user
from app.schemas.note import NoteOut

class NoteService:
    
    @staticmethod
    async def get_notes_list(db: AsyncSession):
        result = await db.execute(
            select(Note).order_by(Note.created_at.desc())
        )
        notes = result.scalars().all()
        return notes


    @staticmethod
    async def get_note_by_id(db: AsyncSession, note_id: int) -> Optional[Note]:
        result = await db.execute(
            select(Note).where(Note.id == note_id)
        )
        note = result.scalars().first()
        if not note:
            raise HTTPException(status_code=402, detail="Note not found")
        return note 
    
    @staticmethod
    async def create_note(db: AsyncSession, note_data, current_user) -> NoteOut:
        new_note = Note(
            notiable_id=note_data.notiable_id,
            notiable_type=note_data.notiable_type,
            user_id=note_data.user_id,
            added_by=current_user.id,
            content=note_data.content
        )
        db.add(new_note)
        await db.commit()
        await db.refresh(new_note)
        return new_note

