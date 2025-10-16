@echo off
echo 🚀 STARTING YOUR OPTIMUM SMART SYSTEM
echo =====================================
echo.

echo ✅ Step 1: Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend && venv\Scripts\activate && python manage.py runserver"

echo ✅ Step 2: Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d C:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-frontend && npm start"

echo.
echo 🎉 BOTH SERVERS ARE STARTING!
echo.
echo 📱 ACCESS YOUR SYSTEM:
echo ✅ Frontend: http://localhost:3000
echo ✅ Backend:  http://localhost:8000
echo.
echo 📱 MOBILE ACCESS:
echo ✅ Use your computer's IP address
echo ✅ Example: http://192.168.1.100:3000
echo.
echo 🌍 FEATURES AVAILABLE:
echo ✅ Dashboard with order management
echo ✅ AI-powered insights and analysis
echo ✅ File upload for AI processing
echo ✅ English and Arabic language support
echo ✅ Mobile-compatible design
echo ✅ Professional logo and branding
echo.
echo 🎯 OPEN YOUR BROWSER AND GO TO:
echo http://localhost:3000
echo.
echo Press any key to open in browser...
pause >nul

start http://localhost:3000

echo.
echo 🎉 Your Optimum Smart System is ready!
echo.
pause


