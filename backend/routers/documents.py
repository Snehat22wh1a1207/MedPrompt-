from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import Optional
from datetime import datetime
from bson import ObjectId
import os
import aiofiles

from middleware.auth_middleware import get_current_user
from database import get_database
from services.ocr_service import extract_text_from_file
from services.ai_service import analyze_medical_document
from config import settings

router = APIRouter(prefix="/api/documents", tags=["documents"])

os.makedirs(settings.upload_dir, exist_ok=True)

@router.post("/analyze")
async def analyze_document(
    text: Optional[str] = Form(None),
    language: str = Form("en"),
    inputType: str = Form("text"),
    file: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    
    extracted_text = ""
    file_name = None
    file_path = None
    file_url = None
    original_text = None
    
    if inputType in ["text", "voice"] and text:
        extracted_text = text
        original_text = text
    elif inputType == "file" and file:
        file_content = await file.read()
        file_name = file.filename
        
        # Save file to disk
        safe_filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file_name}"
        file_path = os.path.join(settings.upload_dir, safe_filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        file_url = f"/api/files/{safe_filename}"
        
        # Extract text
        try:
            extracted_text = await extract_text_from_file(file_content, file_name)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error("OCR extraction failed: %s", e)
            raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file. Please ensure it is a valid PDF or image.")
    else:
        raise HTTPException(status_code=400, detail="No input provided")
    
    # Run AI analysis
    ai_result = await analyze_medical_document(extracted_text, language)
    
    doc = {
        "userId": ObjectId(current_user["id"]),
        "medId": current_user["medId"],
        "inputType": inputType,
        "originalText": original_text,
        "fileName": file_name,
        "filePath": file_path,
        "fileUrl": file_url,
        "extractedText": extracted_text,
        "overview": ai_result.get("overview", {}),
        "summary": ai_result.get("summary", ""),
        "language": language,
        "createdAt": datetime.utcnow()
    }
    
    result = await db.documents.insert_one(doc)
    doc_id = str(result.inserted_id)
    
    return {
        "id": doc_id,
        "inputType": inputType,
        "fileName": file_name,
        "fileUrl": file_url,
        "extractedText": extracted_text,
        "overview": ai_result.get("overview", {}),
        "summary": ai_result.get("summary", ""),
        "language": language,
        "createdAt": doc["createdAt"].isoformat()
    }

@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.documents.find(
        {"userId": ObjectId(current_user["id"])},
        {"extractedText": 0}  # exclude large fields
    ).sort("createdAt", -1)
    
    docs = []
    async for doc in cursor:
        docs.append({
            "id": str(doc["_id"]),
            "inputType": doc.get("inputType"),
            "fileName": doc.get("fileName"),
            "fileUrl": doc.get("fileUrl"),
            "overview": doc.get("overview"),
            "summary": doc.get("summary"),
            "language": doc.get("language", "en"),
            "createdAt": doc.get("createdAt").isoformat() if doc.get("createdAt") else None
        })
    
    return docs

@router.get("/{doc_id}")
async def get_document(doc_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    try:
        doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check ownership (or admin)
    if str(doc["userId"]) != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "id": str(doc["_id"]),
        "inputType": doc.get("inputType"),
        "originalText": doc.get("originalText"),
        "fileName": doc.get("fileName"),
        "fileUrl": doc.get("fileUrl"),
        "extractedText": doc.get("extractedText"),
        "overview": doc.get("overview"),
        "summary": doc.get("summary"),
        "language": doc.get("language", "en"),
        "medId": doc.get("medId"),
        "createdAt": doc.get("createdAt").isoformat() if doc.get("createdAt") else None
    }

@router.get("/{doc_id}/download")
async def download_file(doc_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    try:
        doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if str(doc["userId"]) != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not doc.get("filePath") or not os.path.exists(doc["filePath"]):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=doc["filePath"],
        filename=doc.get("fileName", "download"),
        media_type="application/octet-stream"
    )
