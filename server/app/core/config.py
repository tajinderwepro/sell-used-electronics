from pydantic_settings import BaseSettings
from typing import Optional
import os
class Settings(BaseSettings):
    PROJECT_NAME: str = "My Fullstack App"
    API_V1_STR: str = "/api/v1"
    APP_URL: Optional[str] = None
    JWT_SECRET: Optional[str] = None 
    DATABASE_URL: Optional[str] = None
    ALGORITHM: str = "HS256"
    BACKEND_CORS_ORIGINS: list[str] = ["*"]
    ALGORITHM = "HS256"
    EASY_POST_API_KEY: str = os.getenv("EASY_POST_API_KEY", "ep_test_...")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
    CLIENT_URL: str = os.getenv("CLIENT_URL", "sk_test_...")
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24  
    class Config:
        env_file = ".env"
        case_sensitive = True
settings = Settings()
