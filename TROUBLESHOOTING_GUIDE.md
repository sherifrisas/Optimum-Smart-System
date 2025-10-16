# Troubleshooting Guide: "Failed to load orders" Issue

## Problem Description
The Optimum Smart System is showing a "Failed to load orders" error with a Retry button. This typically happens when there's a communication issue between the frontend and backend.

## Common Causes and Solutions

### 1. Backend Server Not Running
**Symptoms**: 
- "Failed to load orders" message
- No data in the dashboard
- API calls fail

**Solution**:
1. Ensure the backend server is running:
   ```
   cd optimum-backend
   venv\Scripts\activate
   python manage.py runserver
   ```
2. Verify you see the message: "Starting development server at http://127.0.0.1:8000/"

### 2. Frontend Server Not Running
**Symptoms**:
- Blank page or error in browser
- Unable to access http://localhost:3000

**Solution**:
1. Start the frontend server:
   ```
   cd optimum-frontend
   npm start
   ```
2. Browser should automatically open to http://localhost:3000

### 3. CORS (Cross-Origin Resource Sharing) Issues
**Symptoms**:
- Console errors about CORS
- Network tab shows blocked requests
- API calls fail with CORS errors

**Solution**:
The CORS settings are already configured in the Django settings.py file. If you're still having issues:
1. Check that the backend is running on port 8000
2. Check that the frontend is running on port 3000
3. Verify CORS settings in `optimum-backend/optimum_system/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]
   ```

### 4. Data Structure Mismatch
**Symptoms**:
- Orders load but don't display correctly
- Missing or incorrect data in components
- JavaScript errors in console

**Solution**:
The issue has been fixed by transforming the data structure in App.js. The backend returns snake_case field names, but the frontend expects camelCase. The transformOrderData function in App.js handles this conversion.

### 5. Database Not Seeded
**Symptoms**:
- Empty order lists
- No data in dashboard
- API returns empty results

**Solution**:
1. Ensure the database is seeded with test data:
   ```
   cd optimum-backend
   venv\Scripts\activate
   python manage.py seed_data
   ```

## Step-by-Step Resolution

### Step 1: Verify Backend is Running
1. Open Command Prompt
2. Navigate to project directory
3. Run:
   ```
   cd optimum-backend
   venv\Scripts\activate
   python manage.py runserver
   ```
4. Confirm you see: "Starting development server at http://127.0.0.1:8000/"

### Step 2: Verify Frontend is Running
1. Open a NEW Command Prompt
2. Navigate to project directory
3. Run:
   ```
   cd optimum-frontend
   npm start
   ```
4. Browser should open automatically to http://localhost:3000

### Step 3: Test API Connection
1. Open browser to http://localhost:8000/api/orders/
2. You should see JSON data with orders
3. If not, check backend server logs for errors

### Step 4: Check Browser Console
1. Open the application at http://localhost:3000
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any error messages
5. Check Network tab for failed API requests

### Step 5: Verify Database Seeding
1. In backend terminal, run:
   ```
   python manage.py seed_data
   ```
2. You should see "Successfully seeded database!"

## Testing the Fix

After implementing the fixes:

1. Refresh the browser at http://localhost:3000
2. The dashboard should now load with order data
3. Navigate to different sections (Orders, Suppliers, Accounting)
4. All components should display data correctly

## If Issues Persist

1. **Clear browser cache**:
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies for localhost

2. **Restart both servers**:
   - Stop both backend and frontend servers (Ctrl+C)
   - Start backend server first
   - Start frontend server second

3. **Check for port conflicts**:
   - Make sure no other applications are using ports 3000 or 8000
   - You can change ports in settings if needed

4. **Reinstall dependencies**:
   ```
   cd optimum-frontend
   rm -rf node_modules
   npm install
   ```

## Verification Commands

Use these commands to verify each component is working:

### Backend Verification
```bash
# Test if backend is running
curl http://localhost:8000/api/orders/

# Check if database has data
curl http://localhost:8000/admin/
```

### Frontend Verification
```bash
# Check if frontend is serving files
curl http://localhost:3000
```

## Common Error Messages and Solutions

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Failed to load orders" | Backend not running or CORS issues | Start backend server, check CORS settings |
| "Network Error" | Server not accessible | Check if servers are running on correct ports |
| "TypeError: Cannot read property 'map' of undefined" | Data structure mismatch | Verify data transformation in App.js |
| Empty dashboard | No seeded data | Run seed_data command |

## Next Steps

Once the "Failed to load orders" issue is resolved:
1. Test all functionality (creating orders, updating status, etc.)
2. Verify responsive design works on different screen sizes
3. Test error handling scenarios
4. Proceed with Phase 2 development (AI integration)

If you continue to experience issues, please provide:
1. Screenshot of the error
2. Browser console output (F12 → Console tab)
3. Network tab information for failed requests
4. Terminal output from both backend and frontend servers