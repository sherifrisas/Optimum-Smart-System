# Server Troubleshooting Guide

## Common Issues and Solutions

### 1. Backend Server Issues

#### Issue: Django server not starting
**Symptoms**: 
- Error messages when running `python manage.py runserver`
- Server fails to start

**Solutions**:
1. Make sure you're in the correct directory:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
   ```

2. Activate the virtual environment:
   ```
   venv\Scripts\activate
   ```

3. Check if all dependencies are installed:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Try running the server:
   ```
   python manage.py runserver
   ```

#### Issue: "Page not found (404)" at root URL
**Symptoms**: 
- Browser shows 404 error when accessing http://localhost:8000/

**Explanation**: 
This is normal behavior. Your Django backend only serves API endpoints, not a web interface.

**Correct URLs to access**:
- API endpoints: http://localhost:8000/api/orders/
- Admin interface: http://localhost:8000/admin/
- Root URL (/) is not defined and will return 404

### 2. Frontend Server Issues

#### Issue: React development server not starting
**Symptoms**: 
- Error messages when running `npm start`
- Server fails to start

**Solutions**:
1. Make sure you're in the correct directory:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Try running the server:
   ```
   npm start
   ```

#### Issue: Frontend not connecting to backend
**Symptoms**: 
- "Failed to load orders" message in the application
- Data not loading in the dashboard

**Solutions**:
1. Make sure both servers are running:
   - Backend: http://localhost:8000
   - Frontend: http://localhost:3000

2. Check browser console for error messages (F12 → Console tab)

3. Verify API endpoints are accessible:
   - http://localhost:8000/api/orders/
   - http://localhost:8000/api/customers/
   - http://localhost:8000/api/suppliers/

### 3. Database Issues

#### Issue: Database not initialized
**Symptoms**: 
- Error messages about database tables
- No data in the application

**Solutions**:
1. Run migrations:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
   venv\Scripts\activate
   python manage.py migrate
   ```

2. Seed initial data:
   ```
   python manage.py seed_data
   ```

### 4. CORS Issues

#### Issue: Cross-Origin Resource Sharing errors
**Symptoms**: 
- Browser console shows CORS errors
- Frontend cannot access backend API

**Solutions**:
1. Check CORS settings in `optimum-backend/optimum_system/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```

2. Make sure both servers are running on the correct ports

### 5. Port Conflicts

#### Issue: Ports already in use
**Symptoms**: 
- Error messages about ports being in use
- Servers fail to start

**Solutions**:
1. Check if other applications are using ports 3000 or 8000:
   ```
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   ```

2. Kill processes using those ports:
   ```
   taskkill /PID <process_id> /F
   ```

3. Or change the ports in the configuration

## Quick Start Commands

### Starting the Backend Server
```bash
cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
venv\Scripts\activate
python manage.py runserver
```

### Starting the Frontend Server
```bash
cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-frontend
npm start
```

### Running Both Servers
You can use the provided batch file:
```
c:\Users\Sherif-Rosas\Optimum_Smart-System\start_servers.bat
```

## Verification Steps

1. **Check backend API**:
   Open browser to http://localhost:8000/api/orders/
   You should see JSON data with orders

2. **Check frontend**:
   Open browser to http://localhost:3000
   You should see the Optimum Smart System dashboard

3. **Check database**:
   Run the seed command to populate with test data:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
   venv\Scripts\activate
   python manage.py seed_data
   ```

## If Issues Persist

1. **Reinstall dependencies**:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-frontend
   rm -rf node_modules
   npm install
   ```

2. **Recreate virtual environment**:
   ```
   cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
   rm -rf venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   ```

3. **Check system requirements**:
   - Python 3.8+
   - Node.js 14+
   - npm 6+

## Useful Debugging Commands

### Check if servers are running
```bash
# Check backend
curl http://localhost:8000/api/orders/

# Check frontend
curl http://localhost:3000
```

### Check database
```bash
cd c:\Users\Sherif-Rosas\Optimum_Smart-System\optimum-backend
venv\Scripts\activate
python manage.py shell
```

Then in the Python shell:
```python
from orders.models import Order
print(Order.objects.count())
```

## Support

If you continue to experience issues, please provide:
1. Error messages from the terminal
2. Browser console output (F12 → Console tab)
3. Network tab information for failed requests
4. Output of `python --version` and `node --version`