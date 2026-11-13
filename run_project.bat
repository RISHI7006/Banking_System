@echo off
echo ========================================================
echo Starting Modern Banking Management System...
echo ========================================================
echo.

echo [1/2] Starting Python FastAPI Backend on port 8000...
start "Modern Banking - Backend API" cmd /k "python run_backend.py"

echo [2/2] Starting React Vite Frontend on port 5173...
start "Modern Banking - Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both servers are launching!
echo Backend:  http://127.0.0.1:8000/docs
echo Frontend: http://localhost:5173
echo ========================================================
echo.
pause
