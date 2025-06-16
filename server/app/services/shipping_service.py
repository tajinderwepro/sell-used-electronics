import easypost
import shippo

class ShippingService:
    def __init__(self, provider: str, api_key: str):
        self.provider = provider.lower()
        if self.provider == "easypost":
            easypost.api_key = 'EZTK3359a5b318964dea9edbd776f9b84a55QKsPQYzf81S0U24maV4zBQ'
        elif self.provider == "shippo":
            shippo.api_key = api_key  
        else:
            raise ValueError("Unsupported provider: use 'easypost' or 'shippo'.")

    def validate_address(self, address: dict):
        if self.provider == "easypost":
            client = easypost.EasyPostClient("EZTK3359a5b318964dea9edbd776f9b84a55QKsPQYzf81S0U24maV4zBQ")

            address = client.address.create(
                verify=True,
                street1="000 unknown street",
                city="NY",
                state="NY",
                zip="10001",
                country="US",
                email="test@example.com",
                phone="5555555555",
            )

            return address.to_dict()

        elif self.provider == "shippo":
            address_obj = shippo.address.create({
                "name": "John Doe",
                "street1": "215 Clayton St.",
                "city": "San Francisco",
                "state": "CA",
                "zip": "94117",
                "country": "US",
                "phone": "555 341 9393",
                "email": "john@example.com"
            })
            validation = address_obj.get("validation_results")
            if validation and validation.get("is_valid"):
                return address_obj
            else:
                raise ValueError("Invalid address")

    
    def create_shipment(self, from_address: dict, to_address: dict, parcel: dict):
        if self.provider == "easypost":
            shipment = easypost.Shipment.create({
                "to_address": to_address,
                "from_address": from_address,
                "parcel": parcel,
            })
            return shipment

        elif self.provider == "shippo":
            shipment = shippo.Shipment.create(
                address_from=from_address,
                address_to=to_address,
                parcels=[parcel],
                **{"async": False}  # ✅ workaround
            )
            return shipment

    def get_lowest_rate(self, shipment):
        if self.provider == "easypost":
            return shipment.lowest_rate()
        elif self.provider == "shippo":
            rates = shipment["rates"]
            return min(rates, key=lambda x: float(x["amount"]))

    def track_order(self, tracking_number: str, carrier: str = None):
        if self.provider == "easypost":
            tracker = easypost.Tracker.create(
                tracking_code=tracking_number,
                carrier=carrier
            )
            return tracker

        elif self.provider == "shippo":
            return shippo.Track.get(tracking_number, carrier)
