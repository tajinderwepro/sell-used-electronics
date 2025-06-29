from app.models.address import Address
from app.schemas.address import AddressCreate, AddressResponse, AddressOut
from app.db.session import async_session
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession


class AddressService:

    @staticmethod
    async def add_address(data: AddressCreate, user_id: int, db: AsyncSession):
        if data.id:
            result = await db.execute(select(Address).where(Address.id == data.id, Address.user_id == user_id))
            address = result.scalars().first()
            if address:
                address.address = data.address
                address.city = data.city
                address.state = data.state
                address.zip = data.zip
                address.country = data.country or 'USA'
                await db.flush()
                await db.commit()  # ✅ COMMIT here
                return {
                    "address": address,
                    "message": "Address updated successfully",
                    "success": True
                }

        new_address = Address(
            user_id=user_id,
            address=data.address,
            city=data.city,
            state=data.state,
            zip=data.zip,
            country=data.country or 'USA',
            status=True
        )
        db.add(new_address)
        await db.flush()
        await db.refresh(new_address)
        await db.commit()  # ✅ COMMIT here

        return {
            "address": new_address,
            "message": "Address added successfully",
            "success": True
        }


    @staticmethod
    async def get_address_by_id(user_id: int):
        async with async_session() as session:
            result = await session.execute(
                select(Address).where(Address.user_id == user_id)
                .order_by(Address.id) 
            )
            address = result.scalars().all()
            if address:
                return {
                    "address": address,
                    "message": "Address fetched successfully",
                    "success": True
                }
            return {"message": "Address not found", "success": False}

    @staticmethod
    async def delete_address(id: int):
        async with async_session() as session:
            result = await session.execute(select(Address).where(Address.id == id))
            address = result.scalars().first()

            if address:
                await session.delete(address)
                await session.commit()
                return {
                    "address": address,
                    "message": "Address deleted successfully",
                    "success": True
                }

            return {"message": "Address not found", "success": False}

