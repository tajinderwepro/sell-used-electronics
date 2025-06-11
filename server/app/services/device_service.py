from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.device import Device
from app.models.model import Model
from app.models.brand import Brand
from app.models.category import Category
from app.schemas.device import DeviceCreate, DeviceUpdate, DeviceOut
from sqlalchemy.orm import selectinload
from sqlalchemy import cast, Integer

class DeviceService:

    @staticmethod
    async def get_all_devices(db: AsyncSession):
        result = await db.execute(select(Device))
        devices = result.scalars().all()

        response = []

        for device in devices:
            category = None
            brand = None
            model = None

            try:
                if device.category:
                    category_id = int(device.category)
                    category_result = await db.execute(
                        select(Category).where(Category.id == category_id)
                    )
                    category = category_result.scalar_one_or_none()
            except ValueError:
                pass  # Invalid ID string

            try:
                if device.brand:
                    brand_id = int(device.brand)
                    brand_result = await db.execute(
                        select(Brand).where(Brand.id == brand_id)
                    )
                    brand = brand_result.scalar_one_or_none()
            except ValueError:
                pass

            try:
                if device.model:
                    model_id = int(device.model)
                    model_result = await db.execute(
                        select(Model).where(Model.id == model_id)
                    )
                    model = model_result.scalar_one_or_none()
            except ValueError:
                pass

            response.append({
                "id": device.id,
                "category": device.category,
                "brand": device.brand,
                "model": device.model,
                "category_name": category.name if category else None,
                "brand_name": brand.name if brand else None,
                "model_name": model.name if model else None,
                "condition": device.condition,
                "base_price": device.base_price,
                "ebay_avg_price": device.ebay_avg_price,
            })

        return response
    @staticmethod
    async def create_device(device_in: DeviceCreate, db: AsyncSession):
        device = Device(
            condition=device_in.condition,
            base_price=device_in.base_price,
            ebay_avg_price=device_in.ebay_avg_price,
            category=device_in.category,
            brand=device_in.brand,
            model=device_in.model
        )

        db.add(device)
        await db.commit()
        await db.refresh(device)

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
        result = await db.execute(select(Device).where(Device.id == device_id))
        return result.scalar_one_or_none()

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
        return device

    # ✅ Add Category
    @staticmethod
    async def add_category(category: str, db: AsyncSession):
        result = await db.execute(select(Device).where(Device.category == category))
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Category already exists"}

        new = Device(
            category=category,
            brand="",
            model="",
            condition="",
            base_price=0.0,
            ebay_avg_price=0.0
        )
        db.add(new)
        await db.commit()
        return {"success": True, "message": "Category added"}

    #  Add Brand
    @staticmethod
    async def add_brand(category: str, brand: str, db: AsyncSession):
        result = await db.execute(
            select(Device).where(Device.category == category, Device.brand == brand)
        )
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Brand already exists in this category"}

        new = Device(
            category=category,
            brand=brand,
            model="",
            condition="",
            base_price=0.0,
            ebay_avg_price=0.0
        )
        db.add(new)
        await db.commit()
        return {"success": True, "message": "Brand added"}

    # Add Model
    @staticmethod
    async def add_model(category: str, brand: str, model: str, db: AsyncSession):
        result = await db.execute(
            select(Device).where(
                Device.category == category,
                Device.brand == brand,
                Device.model == model
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            return {"success": False, "message": "Model already exists under this brand"}

        new = Device(
            category=category,
            brand=brand,
            model=model,
            condition="",
            base_price=0.0,
            ebay_avg_price=0.0
        )
        db.add(new)
        await db.commit()
        return {"success": True, "message": "Model added"}

    @staticmethod
    async def get_all_categories(db):
        result = await db.execute(select(distinct(Device.category)))
        return [row[0] for row in result.fetchall() if row[0]]

    @staticmethod
    async def get_all_brands(db):
        result = await db.execute(select(distinct(Device.brand)))
        return [row[0] for row in result.fetchall() if row[0]]

    @staticmethod
    async def get_all_models(db):
        result = await db.execute(select(distinct(Device.model)))
        return [row[0] for row in result.fetchall() if row[0]]
