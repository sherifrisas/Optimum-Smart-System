@echo off
echo Optimum Smart System - Test Runner
echo ==================================
echo.

echo 1. Testing Backend API...
echo ------------------------
cd optimum-backend
call venv\Scripts\activate
python ../test_backend.py
cd ..

echo.
echo 2. Testing Frontend Components...
echo -----------------------------
cd optimum-frontend
npm test -- --watchAll=false
cd ..

echo.
echo 3. Manual Testing Instructions:
echo -----------------------------
echo To manually test the complete system:
echo 1. Run start-both.bat
echo 2. Open browser to http://localhost:3000
echo 3. Follow the TESTING_GUIDE.md instructions
echo.

pause