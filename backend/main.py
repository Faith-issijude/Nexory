from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import sqlite3
import shutil
from pathlib import Path
from PIL import Image
import pytesseract
import uuid
import platform

if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

DB_PATH = "nexory.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            extracted_text TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()


@app.get("/")
def home():
    return {"message": "Nexory backend is running"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = Image.open(file_path)
    extracted_text = pytesseract.image_to_string(image)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO memories (filename, extracted_text) VALUES (?, ?)",
        (unique_filename, extracted_text)
    )
    conn.commit()
    conn.close()

    return {
        "message": "File uploaded and processed successfully",
        "filename": unique_filename,
        "extracted_text": extracted_text
    }


@app.get("/search")
def search_memories(q: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, filename, extracted_text FROM memories WHERE extracted_text LIKE ?",
        (f"%{q}%",)
    )
    results = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "image_url": f"/uploads/{row[1]}",
            "extracted_text": row[2]
        }
        for row in results
    ]