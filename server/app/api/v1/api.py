from fastapi import APIRouter
from app.api.v1.endpoints import users, auth, device,order

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])  
api_router.include_router(device.router, prefix="/devices", tags=["devices"]) 
api_router.include_router(order.router, prefix="/orders", tags=["orders"])  