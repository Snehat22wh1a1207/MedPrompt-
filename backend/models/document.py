from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DocumentCreate(BaseModel):
    inputType: str  # text | file | voice
    originalText: Optional[str] = None
    language: str = "en"

class DocumentInDB(BaseModel):
    id: Optional[str] = None
    userId: str
    medId: str
    inputType: str
    originalText: Optional[str] = None
    fileName: Optional[str] = None
    filePath: Optional[str] = None
    fileUrl: Optional[str] = None
    extractedText: Optional[str] = None
    overview: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    language: str = "en"
    createdAt: datetime = None

class DocumentResponse(BaseModel):
    id: str
    userId: str
    medId: str
    inputType: str
    originalText: Optional[str] = None
    fileName: Optional[str] = None
    fileUrl: Optional[str] = None
    extractedText: Optional[str] = None
    overview: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    language: str = "en"
    createdAt: Optional[datetime] = None
