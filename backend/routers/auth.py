from fastapi import APIRouter, HTTPException, status, Depends
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from schemas.user import SignupRequest, LoginRequest, TokenResponse
from services.medid_service import generate_unique_medid
from database import get_database
from config import settings
from middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)

@router.post("/signup")
async def signup(request: SignupRequest):
    db = get_database()
    
    existing = await db.users.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(request.password)
    medid = await generate_unique_medid()
    
    role = "admin" if request.email == settings.admin_email else "user"
    
    user_doc = {
        "name": request.name,
        "email": request.email,
        "password": hashed_password,
        "medId": medid,
        "role": role,
        "createdAt": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    token = create_access_token({"sub": user_id, "email": request.email, "role": role})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": request.name,
            "email": request.email,
            "medId": medid,
            "role": role
        }
    }

@router.post("/login")
async def login(request: LoginRequest):
    db = get_database()
    
    user = await db.users.find_one({"email": request.email})
    if not user or not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "email": user["email"], "role": user["role"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "medId": user["medId"],
            "role": user["role"]
        }
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "medId": current_user["medId"],
        "role": current_user["role"]
    }
