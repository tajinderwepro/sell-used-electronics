from fastapi import FastAPI
# from .routes import user, product
from fastapi.middleware.cors import CORSMiddleware
from .middlewares.authmiddleware import authenticate_user  # import custom middleware
from app.routes import (
    user_routes,
    auth_routes
    # device_routes,
    # quote_routes,
    # order_routes,
    # payment_routes,
    # pricing_log_routes
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(authenticate_user)
app.include_router(user_routes.router)
app.include_router(auth_routes.router)
# app.include_router(device_routes.router)
# app.include_router(quote_routes.router)
# app.include_router(order_routes.router)
# app.include_router(payment_routes.router)
# app.include_router(pricing_log_routes.router)
