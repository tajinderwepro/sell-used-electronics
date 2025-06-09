
from app.models.device import Device
from app.schemas.device import DeviceOut,DeviceCreate,DeviceUpdate
from app.db.session import async_session
from sqlalchemy.future import select

class DeviceService:

    @staticmethod
    async def get_all_devices(db: async_session):
        result = await db.execute(select(Device))
        devices = result.scalars().all()
        return devices
    @staticmethod
    async def create_device(device_in: DeviceCreate, db: async_session):
        device = Device(**device_in.dict())
        db.add(device)
        await db.commit()
        await db.refresh(device)
        return device
    @staticmethod
    async def delete_device(device_id: int, db: async_session):
        result = await db.execute(select(Device).where(Device.id == device_id))
        device = result.scalar_one_or_none()

        if device is None:
            return False

        await db.delete(device)
        await db.commit()
        return True
    
    @staticmethod
    async def get_device_by_id(device_id: int, db: async_session):
        result = await db.execute(select(Device).where(Device.id == device_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def update_device(device_id: int, device_in: DeviceUpdate, db: async_session):
        query = await db.execute(select(Device).where(Device.id == device_id))
        device = query.scalar_one_or_none()

        if not device:
            return None
        
        for field, value in device_in.dict(exclude_unset=True).items():
            setattr(device, field, value)

        db.add(device)
        await db.commit()
        await db.refresh(device)
        return device