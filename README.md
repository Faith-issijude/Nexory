# Nexory Local Setup Guide for VS Code

This guide explains how to run the Nexory project on your own laptop using Visual Studio Code.

Please follow the steps carefully.

---

# What You Are Running

Nexory has two parts:

1. Backend
   This handles image upload, OCR text extraction, storage, and search.

2. Frontend
   This is the user interface where you upload screenshots and search saved memories.

Both must run at the same time.

---

# Folder Structure

When you open the project in VS Code, it should look like this:

```bash
nexory/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── uploads/
│   └── nexory.db
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Tools You Need Installed

Before running the project, install:

1. Python
2. Node.js
3. Tesseract OCR
4. Visual Studio Code

---

# STEP 1 — Open the Project in VS Code

Open VS Code.

Click:

```text
File → Open Folder
```

Select the main project folder:

```text
nexory
```

Do not open only frontend or only backend.

Open the full `nexory` folder.

---

# STEP 2 — Open VS Code Terminal

In VS Code, open terminal:

```text
Terminal → New Terminal
```

You will use two terminals:

* one terminal for backend
* one terminal for frontend

---

# STEP 3 — Run the Backend

In the first terminal, enter backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate it:

For Windows:

```bash
venv\Scripts\activate
```

Install requirements:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn main:app --reload
```

If it works, you should see:

```text
Uvicorn running on http://127.0.0.1:8000
```

Open this in your browser:

```text
http://127.0.0.1:8000
```

Expected response:

```json
{"message":"Nexory backend is running"}
```

Leave this backend terminal running.

Do not close it.

---

# STEP 4 — Run the Frontend

Open another terminal in VS Code.

Make sure you are inside the main `nexory` folder.

Enter frontend:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

If it works, you should see:

```text
http://localhost:5173
```

Open the link in your browser.

Leave this frontend terminal running too.

---

# STEP 5 — Install Tesseract OCR

Tesseract OCR is required for Nexory to read text from uploaded screenshots.

## For Windows

Download and install Tesseract from:

```text
https://github.com/UB-Mannheim/tesseract/wiki
```

After installing, confirm this file exists:

```text
C:\Program Files\Tesseract-OCR\tesseract.exe
```

In `backend/main.py`, this line should be present:

```python
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

If your Tesseract installed in a different folder, update the path.

---

# STEP 6 — How to Test the App

Make sure both servers are running:

Backend:

```text
http://127.0.0.1:8000
```

Frontend:

```text
http://localhost:5173
```

Then:

1. Open the frontend link.
2. Upload a screenshot or image with readable text.
3. Wait for the upload to process.
4. Search for a word inside the uploaded image.
5. Nexory should return the matching image and extracted text.

Example:

If the uploaded image contains:

```text
Career Development Workshop
```

Search:

```text
Career
```

Nexory should return the image.

---

# STEP 7 — Common Problems

## Problem: `npm is not recognized`

This means Node.js is not installed properly.

Fix:

Install Node.js LTS, close VS Code, reopen it, then run:

```bash
node -v
npm -v
```

---

## Problem: `python is not recognized`

This means Python is not installed properly or was not added to PATH.

Fix:

Install Python again and tick:

```text
Add Python to PATH
```

Then reopen VS Code.

---

## Problem: `Could not open requirements file`

You are probably not inside the backend folder.

Fix:

```bash
cd backend
pip install -r requirements.txt
```

---

## Problem: Upload works but extracted text is empty

This may mean:

* the image has no readable text
* the image is blurry
* the text is too small
* the contrast is poor

Use a clearer screenshot with bold text.

---

## Problem: Frontend opens but upload/search does not work

Check that the backend is still running.

Backend must be active at:

```text
http://127.0.0.1:8000
```

If backend terminal was closed, restart it:

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

---

# STEP 8 — Important Note

Do not close the backend terminal while testing.

Do not close the frontend terminal while testing.

For Nexory to work locally, both servers must run together:

```text
Backend = FastAPI
Frontend = React/Vite
```

---

# Current MVP Flow

```text
Upload screenshot
↓
Extract text using OCR
↓
Save memory
↓
Search memory
↓
Retrieve matching image
```

This proves the first working version of Nexory.
