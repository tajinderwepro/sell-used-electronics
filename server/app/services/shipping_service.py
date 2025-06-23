import easypost
import shippo
from app.core.config import settings
from app.services.log_service import LogService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
from app.models.quote import Quote
from app.models.address import Address
from app.models.user import User
from app.schemas.orders import OrderCreate
from app.services.order_service import OrderService

class ShippingService:
    def __init__(self):
        self.provider = "easypost"
        self.client = easypost.EasyPostClient(settings.EASY_POST_API_KEY)

    async def create_shipment(self, from_address, to_address, parcel, db: AsyncSession, request, current_user, quote_id):
        try:
            if self.provider == "easypost":
                shipment = self.client.shipment.create(
                    to_address=to_address,
                    from_address=from_address,
                    parcel=parcel,
                )
                shipment_dict = shipment.to_dict()

                await LogService.store(
                    action="Shipment Created",
                    description=f"Created shipment : {shipment_dict} for quote ID {quote_id}.",
                    current_user=current_user,
                    ip_address=request.client.host,
                    request=request,
                    db=db,
                    quote_id=quote_id
                )
                return shipment_dict

            elif self.provider == "shippo":
                shipment = shippo.Shipment.create(
                    address_from=from_address,
                    address_to=to_address,
                    parcels=[parcel],
                    **{"async": False}
                )
                return shipment

        except Exception as e:
            await LogService.store(
                action="Shipment Creation Failed",
                description=f"Failed to create shipment for quote ID {quote_id}: {str(e)}",
                current_user=current_user,
                ip_address=request.client.host,
                request=request,
                db=db,
                quote_id=quote_id
            )
            raise

    def get_lowest_rate(self, shipment):
        if self.provider == "easypost" and hasattr(shipment, "lowest_rate"):
            return shipment.lowest_rate().to_dict()
        elif self.provider == "shippo":
            rates = shipment.get("rates", [])
            return min(rates, key=lambda x: float(x["amount"])) if rates else None

    async def buy_shipment(self, shipment_id: str, db: AsyncSession, request, current_user, quote_id, insurance: float = 0.0):
        try:
            retrieved = self.client.shipment.retrieve(shipment_id)
            bought_shipment = self.client.shipment.buy(
                retrieved.id,
                rate=retrieved.lowest_rate(),
                insurance=insurance if insurance else None
            )
            bought_shipment_dict = bought_shipment.to_dict()

            await LogService.store(
                action="Shipment Purchased",
                description=f"Shipment purchased for quote ID {quote_id}, shipment ID {shipment_id}. Tracking: {bought_shipment_dict}",
                current_user=current_user,
                ip_address=request.client.host,
                request=request,
                db=db,
                quote_id=quote_id
            )
            return bought_shipment_dict

        except Exception as e:
            await LogService.store(
                action="Shipment Purchase Failed",
                description=f"Failed to purchase shipment ID {shipment_id} for quote ID {quote_id}: {str(e)}",
                current_user=current_user,
                ip_address=request.client.host,
                request=request,
                db=db,
                quote_id=quote_id
            )
            raise

    async def validate_address(self, address: dict, db: AsyncSession, request, current_user, quote_id=None):
        try:
            if self.provider == "easypost":
                verified_address = easypost.Address.create(verify=["delivery"], **address)
                verified_dict = verified_address.to_dict()

                await LogService.store(
                    action="Address Validated",
                    description=f"Validated address for quote ID {quote_id or 'N/A'}",
                    current_user=current_user,
                    ip_address=request.client.host,
                    request=request,
                    db=db,
                    quote_id=quote_id
                )
                return verified_dict

            elif self.provider == "shippo":
                address_obj = shippo.Address.create(address)
                validation = address_obj.get("validation_results")
                if validation and validation.get("is_valid"):
                    return address_obj
                raise ValueError("Invalid address")

        except Exception as e:
            await LogService.store(
                action="Address Validation Failed",
                description=f"Address validation failed: {str(e)}",
                current_user=current_user,
                ip_address=request.client.host,
                request=request,
                db=db,
                quote_id=quote_id
            )
            raise

    async def track_order(self, tracking_number: str, carrier: str = None, db=None, request=None, current_user=None, quote_id=None):
        try:
            if self.provider == "easypost":
                tracker = easypost.Tracker.create(tracking_code=tracking_number, carrier=carrier)
                tracker_dict = tracker.to_dict()

                if db and request:
                    await LogService.store(
                        action="Shipment Tracked",
                        description=f"Tracked order with tracking number {tracking_number}",
                        current_user=current_user,
                        ip_address=request.client.host,
                        request=request,
                        db=db,
                        quote_id=quote_id
                    )
                return tracker_dict

            elif self.provider == "shippo":
                return shippo.Track.get(tracking_number, carrier)

        except Exception as e:
            if db and request:
                await LogService.store(
                    action="Tracking Failed",
                    description=f"Failed to track order: {str(e)}",
                    current_user=current_user,
                    ip_address=request.client.host,
                    request=request,
                    db=db,
                    quote_id=quote_id
                )
            raise

    @staticmethod
    async def request_shipment(request, db: AsyncSession, quote_id: int, current_user):
        result = await db.execute(select(Quote).where(Quote.id == quote_id))
        quote = result.scalars().first()
        if not quote:
            return {"message": "Quote not found", "success": False}

        user_result = await db.execute(select(User).where(User.id == quote.user_id))
        user = user_result.scalars().first()
        if not user:
            return {"message": "User not found", "success": False}

        address_result = await db.execute(select(Address).where(Address.user_id == quote.user_id))
        address = address_result.scalars().first()
        if not address:
            return {"message": "Address not found", "success": False}

        admin_result = await db.execute(select(User).where(User.role == 'admin').order_by(asc(User.id)))
        admin = admin_result.scalars().first()
        if not admin:
            return {"message": "Admin not found", "success": False}

        admin_address_result = await db.execute(select(Address).where(Address.user_id == admin.id))
        admin_address = admin_address_result.scalars().first()
        if not admin_address:
            return {"message": "Admin address not found", "success": False}

        to_address = {
            "name": admin.name,
            "street1": admin_address.address,
            "city": admin_address.city,
            "state": admin_address.state,
            "zip": admin_address.zip,
            "country": "US",
            "phone": admin.phone
        }

        from_address = {
            "name": user.name,
            "street1": address.address,
            "city": address.city,
            "state": address.state,
            "zip": address.zip,
            "country": "US",
            "phone": user.phone
        }

        parcel = {"length": 10.0, "width": 5.0, "height": 3.0, "weight": 1.5}

        service = ShippingService()
        shipment_id = None
        order = None
        response_message = ""
        success = False
        lowest_rate = None

        try:
            shipment = await service.create_shipment(
                from_address=from_address,
                to_address=to_address,
                parcel=parcel,
                db=db,
                request=request,
                current_user=current_user,
                quote_id=quote.id
            )
            shipment_id = shipment.get("id")
            lowest_rate = service.get_lowest_rate(shipment)

            bought_shipment = await service.buy_shipment(
                shipment_id=shipment_id,
                db=db,
                request=request,
                current_user=current_user,
                quote_id=quote.id,
                insurance=249.99
            )

            order_data = OrderCreate(
                quote_id=quote.id,
                user_id=quote.user_id,
                status="pending",
                total_amount=quote.amount,
                shipping_label_url=bought_shipment["postage_label"]["label_url"],
                tracking_number=bought_shipment["tracker"]["id"],
                tracking_url=bought_shipment["tracker"]["public_url"],
            )
            quote.status = "shipped"
            await db.commit()
            await db.refresh(quote)

            order = await OrderService.create_order(db, order_data)
            response_message = "Ordered successfully"
            success = True

            return {
                "order": order.to_dict() if hasattr(order, "to_dict") else order,
                "lowest_rate": lowest_rate,
                "success": True,
                "message": response_message
            }

        except Exception as e:
            return {"message": str(e), "success": False}

        finally:
            await LogService.store(
                action="Shipping Request",
                description=(
                    f"User '{current_user.name.capitalize()}' with role '{current_user.role}' "
                    f"initiated a shipping request for quote ID {quote.id}, "
                    f"{f'shipment ID {shipment_id}, ' if shipment_id else ''}"
                    f"{f'order ID {order.id}, ' if order else ''}"
                    f"result: {'success' if success else 'failed'} - {response_message}"
                ),
                current_user=current_user,
                ip_address=request.client.host,
                request=request,
                db=db,
                quote_id=quote.id
            )
