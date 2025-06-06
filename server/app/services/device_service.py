
from app.models.device import Device
from app.schemas.device import DeviceOut
from app.db.session import async_session
from sqlalchemy.future import select

class DeviceService:

    @staticmethod
    async def get_list():
        async with async_session() as session:
            result = await session.execute(select(Device))
            devices = result.scalars().all()
            return {
                "data": [DeviceOut.from_orm(device) for device in devices],
                "message": "Devices fetched successfully",
                "success": True
            }
