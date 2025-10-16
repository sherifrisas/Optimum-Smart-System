@echo off
echo Starting Optimum Smart System Servers...
echo ======================================

echo.
echo Starting Backend Server...
echo ------------------------
cd /d "c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend"
start "Backend Server" cmd /k "venv\Scripts\activate && python manage.py runserver"

timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
echo -------------------------
cd /d "c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-frontend"
start "Frontend Server" cmd /k "npm start"

echo.
echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause >nul