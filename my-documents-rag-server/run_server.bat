@echo off
echo [📦] Activating virtual environment...
call venv\Scripts\activate

echo [🚀] Starting FastAPI server at http://localhost:8000 ...
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

pause
