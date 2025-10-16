@echo off
echo Optimum Smart System - Restart Script
echo ====================================

echo.
echo Stopping any existing servers...
echo (If prompted, press Ctrl+C to stop servers, then run this script again)
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd optimum-backend && venv\Scripts\activate && python manage.py runserver"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd optimum-frontend && npm start"

echo.
echo Servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo If you see "Failed to load orders" error:
echo 1. Wait 10-15 seconds for servers to fully start
echo 2. Refresh the browser at http://localhost:3000
echo 3. Check TROUBLESHOOTING_GUIDE.md if issues persist
echo.

pause