from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings  
from .middlewares.authmiddleware import authenticate_user 

app = FastAPI(title=settings.PROJECT_NAME)

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.middleware("http")(authenticate_user)

app.include_router(api_router, prefix="/api/v1", tags=["v1"])
