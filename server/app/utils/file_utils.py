# file: app/utils/file_utils.py
import os
import uuid

UPLOAD_DIR = "uploads"

def save_file_with_unique_name(file_data: bytes, original_filename: str) -> str:
    ext = os.path.splitext(original_filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    with open(file_path, "wb") as f:
        f.write(file_data)

    return file_path
