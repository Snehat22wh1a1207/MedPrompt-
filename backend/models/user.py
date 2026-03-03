from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = None
    medId: str
    role: str = "user"
    createdAt: datetime = None
    hashed_password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    medId: str
    role: str
    createdAt: Optional[datetime] = None
