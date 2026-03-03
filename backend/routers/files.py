from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
from config import settings

router = APIRouter(prefix="/api/files", tags=["files"])

@router.get("/{filename}")
async def serve_file(filename: str):
    file_path = os.path.join(settings.upload_dir, filename)
    if not os.path.exists(file_path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)
