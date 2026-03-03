from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import FileResponse
from bson import ObjectId
import os

from middleware.auth_middleware import get_admin_user
from database import get_database

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users")
async def list_all_users(admin: dict = Depends(get_admin_user)):
    db = get_database()
    cursor = db.users.find({}, {"password": 0}).sort("createdAt", -1)
    
    users = []
    async for user in cursor:
        # Count documents
        doc_count = await db.documents.count_documents({"userId": user["_id"]})
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "medId": user.get("medId"),
            "role": user.get("role"),
            "documentCount": doc_count,
            "createdAt": user.get("createdAt").isoformat() if user.get("createdAt") else None
        })
    
    return users

@router.get("/users/search")
async def search_user_by_medid(medid: str = Query(...), admin: dict = Depends(get_admin_user)):
    db = get_database()
    
    user = await db.users.find_one({"medId": medid.upper()}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    doc_count = await db.documents.count_documents({"userId": user["_id"]})
    
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "medId": user.get("medId"),
        "role": user.get("role"),
        "documentCount": doc_count,
        "createdAt": user.get("createdAt").isoformat() if user.get("createdAt") else None
    }

@router.get("/users/{medid}/documents")
async def get_user_documents(medid: str, admin: dict = Depends(get_admin_user)):
    db = get_database()
    
    user = await db.users.find_one({"medId": medid.upper()})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    cursor = db.documents.find(
        {"userId": user["_id"]},
        {"extractedText": 0}
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

@router.get("/documents/{doc_id}/download")
async def admin_download_file(doc_id: str, admin: dict = Depends(get_admin_user)):
    db = get_database()
    
    try:
        doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    except Exception:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not doc.get("filePath") or not os.path.exists(doc["filePath"]):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=doc["filePath"],
        filename=doc.get("fileName", "download"),
        media_type="application/octet-stream"
    )
