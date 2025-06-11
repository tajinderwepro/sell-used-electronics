from fastapi import APIRouter, Depends
from app.api.v1.endpoints import users, auth, device, order, category, brand, model, address
from app.core.security import get_current_user_id  

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

api_router.include_router(
    users.router, 
    prefix="/users", 
    tags=["users"],
    dependencies=[Depends(get_current_user_id)]
)
api_router.include_router(
    device.router, 
    prefix="/devices", 
    tags=["devices"],
    dependencies=[Depends(get_current_user_id)]
)
api_router.include_router(
    order.router, 
    prefix="/orders", 
    tags=["orders"],
    dependencies=[Depends(get_current_user_id)]
)

api_router.include_router(
    category.router, 
    prefix="/category", 
    tags=["category"],
    dependencies=[Depends(get_current_user_id)]
)

api_router.include_router(
    brand.router, 
    prefix="/brand", 
    tags=["brand"],
    dependencies=[Depends(get_current_user_id)]
)

api_router.include_router(
    model.router, 
    prefix="/model", 
    tags=["model"],
    dependencies=[Depends(get_current_user_id)]
)

api_router.include_router(
    address.router, 
    prefix="/addresses", 
    tags=["addresses"],
    dependencies=[Depends(get_current_user_id)]
)
