@echo off
echo Starting Optimum Smart System Backend...
cd optimum-backend
call venv\Scripts\activate
python manage.py runserver
pause
