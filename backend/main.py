from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from config import settings
from database import connect_to_mongo, close_mongo_connection
from routers import auth, documents, admin, files

app = FastAPI(title="MedPrompt API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs(settings.upload_dir, exist_ok=True)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Include routers
app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(admin.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {"message": "MedPrompt API is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}
