from fastapi import APIRouter, Depends
from app.api.v1.endpoints import auth, shipment
from app.api.v1.endpoints.admin import device, order, category, brand, model, quote
from app.api.v1.endpoints.payments import payments
from app.api.v1.endpoints.public import common
from app.api.v1.endpoints.user import users
from app.api.v1.endpoints.public import address
from app.core.security import get_current_user
from app.core.security import require_roles

# Main API router
api_router = APIRouter()

# Webhook routes group
api_router.include_router(shipment.router, prefix="/shipment", tags=["webhook"])

# Authentication routes group
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# User routes group
user_router = APIRouter(prefix="/users", dependencies=[Depends(require_roles(["user","admin"]))])
user_router.include_router(payments.router, prefix="/payments/stripe", tags=["stripe"])
user_router.include_router(users.router, tags=["users"])

# Admin routes group
admin_router = APIRouter(prefix="/admin")
admin_router.include_router(device.router, prefix="/devices", tags=["devices"])
admin_router.include_router(quote.router, prefix="/quotes", tags=["quotes"])
admin_router.include_router(order.router, prefix="/orders", tags=["orders"], dependencies=[Depends(require_roles(["admin"]))])
admin_router.include_router(brand.router, prefix="/brand", tags=["brand"], dependencies=[Depends(require_roles(["admin"]))])
admin_router.include_router(model.router, prefix="/model", tags=["model"], dependencies=[Depends(require_roles(["admin"]))])
admin_router.include_router(payments.router, prefix="/payments/stripe", tags=["stripe"],dependencies=[Depends(require_roles(["admin"]))])
admin_router.include_router(
    category.router,
    prefix="/category",
    tags=["category"],
)

api_router.include_router(user_router)
api_router.include_router(admin_router)

# common routes
api_router.include_router(
    common.router,
)

# Public routes group
api_router.include_router(address.router, prefix="/addresses", tags=["addresses"],dependencies=[Depends(require_roles(["user","admin"]))])


