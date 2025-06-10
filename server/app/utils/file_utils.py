import os
import uuid
import shutil
from fastapi import UploadFile, HTTPException
from app.core.config import settings

# Define the upload folder (should be inside a static folder for easier access by FastAPI)
UPLOAD_FOLDER = os.path.join("app", "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_upload_file(file: UploadFile) -> str:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
    
    # Get the file extension and create a unique name
    file_ext = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    
    # Save the file to the upload folder
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the relative URL to the file
    return f"/static/uploads/{file_name}"
