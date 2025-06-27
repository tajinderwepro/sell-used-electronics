from fastapi import APIRouter, Depends
from app.core.security import require_roles

# Public
from app.api.v1.endpoints import auth, shipment, note
from app.api.v1.endpoints.public import common, address

# Admin
from app.api.v1.endpoints.admin import device, order, category, brand, model, quote, risk
from app.api.v1.endpoints.payments import payments as admin_payments

# User
from app.api.v1.endpoints.user import users
from app.api.v1.endpoints.payments import payments as user_payments

# Main API router
api_router = APIRouter()

# Webhook routes
api_router.include_router(shipment.router, prefix="/shipment", tags=["webhook"])

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Public routes
api_router.include_router(common.router)
api_router.include_router(
    address.router, prefix="/addresses", tags=["addresses"],
    dependencies=[Depends(require_roles(["user", "admin"]))]
)

# Notes (Shared between user & admin)
note_router = APIRouter(prefix="/notes", dependencies=[Depends(require_roles(["user", "admin"]))])
note_router.include_router(note.router, tags=["notes"])
api_router.include_router(note_router)


# User routes
user_router = APIRouter(
    prefix="/users",
    dependencies=[Depends(require_roles(["user", "admin"]))]
)
user_router.include_router(user_payments.router, prefix="/payments/stripe", tags=["stripe"])
user_router.include_router(users.router, tags=["users"])
api_router.include_router(user_router)

# Admin routes
admin_router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(require_roles(["admin"]))]
)
admin_router.include_router(device.router, prefix="/devices", tags=["devices"])
admin_router.include_router(risk.router, prefix="/risk-management", tags=["risk-management"])
admin_router.include_router(quote.router, prefix="/quotes", tags=["quotes"])
admin_router.include_router(order.router, prefix="/orders", tags=["orders"])
admin_router.include_router(brand.router, prefix="/brand", tags=["brand"])
admin_router.include_router(model.router, prefix="/model", tags=["model"])
admin_router.include_router(admin_payments.router, prefix="/payments/stripe", tags=["stripe"])
admin_router.include_router(category.router, prefix="/category", tags=["category"])  # Uncomment if needed
api_router.include_router(admin_router)
