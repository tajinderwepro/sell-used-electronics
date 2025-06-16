from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal, Optional
from shipping_service import ShippingService

router = APIRouter(prefix="/shipping", tags=["Shipping"])

# Replace with your real keys
API_KEYS = {
    "easypost": "EASYPOST_API_KEY",
    "shippo": "SHIPPO_API_KEY"
}

# ----------- Request Models -----------

class AddressModel(BaseModel):
    name: Optional[str] = None
    street1: str
    street2: Optional[str] = None
    city: str
    state: str
    zip: str
    country: str = "US"
    phone: str

class ParcelModel(BaseModel):
    length: float
    width: float
    height: float
    weight: float

class ShipmentRequest(BaseModel):
    provider: Literal["easypost", "shippo"]
    from_address: AddressModel
    to_address: AddressModel
    parcel: ParcelModel

class AddressValidationRequest(BaseModel):
    provider: Literal["easypost", "shippo"]
    address: AddressModel

# ----------- Endpoints -----------

@router.post("/validate-address")
def validate_address(request: AddressValidationRequest):
    try:
        service = ShippingService(request.provider, API_KEYS[request.provider])
        result = service.validate_address(request.address.dict())
        return {"valid": True, "address": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/create-shipment")
def create_shipment(request: ShipmentRequest):
    try:
        service = ShippingService(request.provider, API_KEYS[request.provider])
        shipment = service.create_shipment(
            from_address=request.from_address.dict(),
            to_address=request.to_address.dict(),
            parcel=request.parcel.dict()
        )
        rate = service.get_lowest_rate(shipment)
        return {"shipment": shipment, "lowest_rate": rate}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/track")
def track_order(provider: Literal["easypost", "shippo"], tracking_number: str, carrier: Optional[str] = None):
    try:
        service = ShippingService(provider, API_KEYS[provider])
        tracking = service.track_order(tracking_number, carrier)
        return {"tracking_status": tracking}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
