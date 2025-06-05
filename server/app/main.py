from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings  
from .middlewares.authmiddleware import authenticate_user 

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.middleware("http")(authenticate_user)

app.include_router(api_router, prefix="/api/v1", tags=["v1"])
