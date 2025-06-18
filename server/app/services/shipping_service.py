import easypost
import shippo
from app.core.config import settings

class ShippingService:
    def __init__(self):
        self.provider = "easypost"
        self.client = easypost.EasyPostClient(settings.EASY_POST_API_KEY)

    def create_shipment(self, from_address, to_address, parcel):
        if self.provider == "easypost":
            shipment = self.client.shipment.create(
                to_address=to_address,
                from_address=from_address,
                parcel=parcel,
            )
            return shipment.to_dict() 

        elif self.provider == "shippo":
            shipment = shippo.Shipment.create(
                address_from=from_address,
                address_to=to_address,
                parcels=[parcel],
                **{"async": False}
            )
            return shipment  

    def get_lowest_rate(self, shipment):
        if self.provider == "easypost":
            if hasattr(shipment, "lowest_rate"):
                return shipment.lowest_rate().to_dict()
        elif self.provider == "shippo":
            rates = shipment["rates"]
            return min(rates, key=lambda x: float(x["amount"]))


    def validate_address(self, address: dict):
        if self.provider == "easypost":
            verified_address = easypost.Address.create(
                verify=["delivery"],
                **address
            )
            return verified_address.to_dict()

        elif self.provider == "shippo":
            address_obj = shippo.Address.create(address)
            validation = address_obj.get("validation_results")
            if validation and validation.get("is_valid"):
                return address_obj
            else:
                raise ValueError("Invalid address")


    def track_order(self, tracking_number: str, carrier: str = None):
        if self.provider == "easypost":
            tracker = easypost.Tracker.create(
                tracking_code=tracking_number,
                carrier=carrier
            )
            return tracker

        elif self.provider == "shippo":
            return shippo.Track.get(tracking_number, carrier)

    def buy_shipment(self, shipment_id: str, insurance: float = 0.0):
        retrieved = self.client.shipment.retrieve(shipment_id)
        bought_shipment = self.client.shipment.buy(
            retrieved.id,
            rate=retrieved.lowest_rate(),
            insurance=insurance if insurance else None
        )
        return bought_shipment.to_dict()


    def track_order(self, tracking_number: str, carrier: str = None):
        if self.provider == "easypost":
            tracker = easypost.Tracker.create(
                tracking_code=tracking_number,
                carrier=carrier
            )
            return tracker.to_dict()

        elif self.provider == "shippo":
            return shippo.Track.get(tracking_number, carrier)