from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from .middlewares.authmiddleware import authenticate_user 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.middleware("http")(authenticate_user)

app.include_router(api_router, prefix="/api/v1")
