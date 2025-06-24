from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.risk_management import RiskManagement
from fastapi import HTTPException
from app.schemas.risk_management import RiskManagementCreate, RiskManagementUpdate


class RiskManagementService:

    @staticmethod
    async def get_list(db: AsyncSession):
        result = await db.execute(select(RiskManagement))
        items = result.scalars().all()
        return {
            "success": True,
            "message": "Data fetched successfully",
            "data": items
        }

    @staticmethod
    async def get_by_id(id: int, db: AsyncSession):
        item = await db.get(RiskManagement, id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return {
            "success": True,
            "message": "Item fetched successfully",
            "data": item
        }

    @staticmethod
    async def create(data: RiskManagementCreate, db: AsyncSession):
        item = RiskManagement(**data.dict())
        db.add(item)
        await db.commit()
        await db.refresh(item)
        return {
            "success": True,
            "message": "Item created successfully",
            "data": item
        }

    @staticmethod
    async def update(id: int, data: RiskManagementUpdate, db: AsyncSession):
        item = await db.get(RiskManagement, id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        for key, value in data.dict(exclude_unset=True).items():
            setattr(item, key, value)
        await db.commit()
        await db.refresh(item)
        return {
            "success": True,
            "message": "Item updated successfully",
            "data": item
        }

    @staticmethod
    async def delete(id: int, db: AsyncSession):
        item = await db.get(RiskManagement, id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        await db.delete(item)
        await db.commit()
        return {
            "success": True,
            "message": "Item deleted successfully"
        }
