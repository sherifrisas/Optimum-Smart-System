@echo off
echo Starting Optimum Smart System...
echo.
echo Starting Backend...
start "Backend" cmd /k "cd optimum-backend && call venv\Scripts\activate && python manage.py runserver"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd optimum-frontend && npm start"
echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause
