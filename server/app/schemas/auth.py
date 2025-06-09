from pydantic import BaseModel
from app.schemas.user import UserOut
class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut
