from pydantic import BaseModel
from app.schemas.user import UserOut
from typing import Optional
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class PasswordResetResponse(BaseModel):
    message: str
    success: bool
    error: Optional[str] = None

class PasswordReset(BaseModel):
    new_password: str
    confirm_password: str



