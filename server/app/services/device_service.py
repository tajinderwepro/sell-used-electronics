from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.device import Device
from app.models.model import Model
from app.models.brand import Brand
from app.models.category import Category
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceOut
from sqlalchemy.orm import selectinload
from sqlalchemy import cast, Integer
from sqlalchemy.orm import joinedload
from typing import Optional, List,Generic, TypeVar
from app.utils.db_helpers import paginate_query
class DeviceService:

    @staticmethod
    async def get_all_devices(
        db: AsyncSession,
        search: Optional[str] = None,
        sort_by: str = "name",
        order_by: str = "asc",
        current_page: int = 1,
        limit: int = 10
    ):
        return await paginate_query(
            db=db,
            model=Device,
            schema=DeviceOut,
            search=search,
            search_fields=[Device.category],
            sort_by=sort_by,
            order_by=order_by,
            current_page=current_page,
            limit=limit,
            options=[
                selectinload(Device.category_rel),
                selectinload(Device.brand_rel),
                selectinload(Device.model_rel),
                selectinload(Device.user)
            ]
        )
    @staticmethod
    async def create_device(user_id: int, device_in: DeviceCreate, db: AsyncSession):
        category_name = None
        brand_name = None
        model_name = None

        try:
            category_id = int(device_in.category)
            category_result = await db.execute(select(Category).where(Category.id == category_id))
            category_obj = category_result.scalar_one_or_none()
            if category_obj:
                category_name = category_obj.name
        except (ValueError, TypeError):
            category_id = None

        try:
            brand_id = int(device_in.brand)
            brand_result = await db.execute(select(Brand).where(Brand.id == brand_id))
            brand_obj = brand_result.scalar_one_or_none()
            if brand_obj:
                brand_name = brand_obj.name
        except (ValueError, TypeError):
            brand_id = None

        try:
            model_id = int(device_in.model)
            model_result = await db.execute(select(Model).where(Model.id == model_id))
            model_obj = model_result.scalar_one_or_none()
            if model_obj:
                model_name = model_obj.name
        except (ValueError, TypeError):
            model_id = None

        device = Device(
            condition=device_in.condition,
            base_price=device_in.base_price,
            ebay_avg_price=device_in.ebay_avg_price,
            model=model_name,
            brand=brand_name,
            category=category_name,
            category_id=category_id,
            brand_id=brand_id,
            model_id=model_id,
            user_id=user_id,
        )

        db.add(device)
        await db.commit()
        await db.refresh(device)
        # Re-fetch with relations loaded to avoid MissingGreenlet
        result = await db.execute(
            select(Device)
            .options(
                selectinload(Device.category_rel),
                selectinload(Device.brand_rel),
                selectinload(Device.model_rel)
            )
            .where(Device.id == device.id)
        )
        device = result.scalar_one()


        return {
            "success": True,
            "message": "Submit successfully",
            "data": [DeviceOut.from_orm(device)],
        }

    @staticmethod
    async def delete_device(device_id: int, db: AsyncSession):
        result = await db.execute(select(Device).where(Device.id == device_id))
        device = result.scalar_one_or_none()

        if not device:
            return False

        await db.delete(device)
        await db.commit()
        return True

    @staticmethod
    async def get_device_by_id(device_id: int, db: AsyncSession):
        result = await db.execute(
            select(Device)
            .options(
                selectinload(Device.category_rel),
                selectinload(Device.brand_rel),
                selectinload(Device.model_rel)
            )
            .where(Device.id == device_id)
        )
        device = result.scalar_one_or_none()
        if not device:
            return None
        return {
            "success": True,
            "message": "Device fetched successfully",
            "data": DeviceOut.from_orm(device),
        }

    @staticmethod
    async def update_device(device_id: int, device_in: DeviceUpdate, db: AsyncSession):
        result = await db.execute(select(Device).where(Device.id == device_id))
        device = result.scalar_one_or_none()

        if not device:
            return None

        for field, value in device_in.dict(exclude_unset=True).items():
            setattr(device, field, value)

        await db.commit()
        await db.refresh(device)
        result = await db.execute(
            select(Device)
            .options(
                selectinload(Device.category_rel),
                selectinload(Device.brand_rel),
                selectinload(Device.model_rel)
            )
            .where(Device.id == device.id)
        )
        device = result.scalar_one()
        return device

    @staticmethod
    async def update_status(device_id: int, user_id: int, status: str, db: AsyncSession):
        result = await db.execute(
            select(Device).where(Device.id == device_id)
        )
        device = result.scalar_one_or_none()

        if not device:
            return None

        device.status = status
        device.user_id = user_id
        await db.commit()
        await db.refresh(device)
        return {
            "success": True,
            "message": "Updated successfully",
        }


    
    