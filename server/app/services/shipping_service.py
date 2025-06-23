import easypost
import shippo
from app.core.config import settings
from app.services.log_service import LogService

class ShippingService:
    def __init__(self):
        self.provider = "easypost"
        self.client = easypost.EasyPostClient(settings.EASY_POST_API_KEY)

    async def create_shipment(self, from_address, to_address, parcel, db, request, current_user, quote_id):
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
                # Optional: Add Shippo logs if needed
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
        if self.provider == "easypost":
            if hasattr(shipment, "lowest_rate"):
                return shipment.lowest_rate().to_dict()
        elif self.provider == "shippo":
            rates = shipment["rates"]
            return min(rates, key=lambda x: float(x["amount"]))

    async def buy_shipment(self, shipment_id: str, db, request, current_user, quote_id, insurance: float = 0.0):
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
                description=(
                    f"Shipment purchased for quote ID {quote_id}, shipment ID {shipment_id}. "
                    f"Tracking: {bought_shipment_dict}"
                ),
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

    async def validate_address(self, address: dict, db, request, current_user, quote_id=None):
        try:
            if self.provider == "easypost":
                verified_address = easypost.Address.create(
                    verify=["delivery"],
                    **address
                )
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
                else:
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
                tracker = easypost.Tracker.create(
                    tracking_code=tracking_number,
                    carrier=carrier
                )
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
