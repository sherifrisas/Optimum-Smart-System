# Optimum Smart System - Testing Guide

## System Overview

The Optimum Smart System is a complete order management solution with:
- Frontend: React.js application with modern UI components
- Backend: Django REST API with PostgreSQL database
- Features: Order management, customer tracking, supplier communication, accounting dashboard

## Prerequisites

Before testing, ensure you have:
1. Python 3.8+ installed
2. Node.js 14+ installed
3. PostgreSQL database (optional, SQLite is used by default for development)

## Starting the System

### Option 1: Using Startup Scripts (Recommended)

1. Open Command Prompt or PowerShell
2. Navigate to the project root directory
3. Run the startup script:
   ```
   start-both.bat
   ```

### Option 2: Manual Start

#### Start the Backend Server

1. Open Command Prompt or PowerShell
2. Navigate to the backend directory:
   ```
   cd optimum-backend
   ```
3. Activate the virtual environment:
   ```
   venv\Scripts\activate
   ```
4. Start the Django server:
   ```
   python manage.py runserver
   ```

#### Start the Frontend Server

1. Open a NEW Command Prompt or PowerShell window
2. Navigate to the frontend directory:
   ```
   cd optimum-frontend
   ```
3. Install dependencies (if not already installed):
   ```
   npm install
   ```
4. Start the React development server:
   ```
   npm start
   ```

## Expected Results After Startup

- Backend server should be running at: http://localhost:8000
- Frontend server should be running at: http://localhost:3000

## Testing Checklist

### 1. Backend API Testing

#### Test 1.1: API Health Check
- Open your web browser
- Go to: http://localhost:8000/api/orders/
- Expected Result: JSON response with seeded orders

#### Test 1.2: Admin Panel Access
- Go to: http://localhost:8000/admin/
- Login with:
  - Username: admin
  - Password: admin123
- Expected Result: Admin interface loads with seeded data

#### Test 1.3: API Endpoints Test
- Test these endpoints:
  - http://localhost:8000/api/orders/
  - http://localhost:8000/api/customers/
  - http://localhost:8000/api/suppliers/
- Expected Result: All endpoints return valid JSON data

### 2. Frontend Component Testing

#### Test 2.1: Dashboard Component
- Open: http://localhost:3000
- Verify:
  - Dashboard loads with statistics
  - Order counts display correctly
  - Status distribution shows visual bars
  - Recent orders list displays
- Expected Result: All data displays correctly with proper styling

#### Test 2.2: Order Reception Component
- Click "New Order" in navigation
- Fill Form:
  - Customer Name: Test Customer
  - Phone: +20 100 999 8888
  - Product: Test Product
  - Quantity: 2
  - Delivery Date: 2025-12-20
- Click "Create Order"
- Expected Result:
  - Form validation works
  - Order created successfully
  - Redirected to Orders list
  - New order appears in list

#### Test 2.3: Order List Component
- Click "Orders" in navigation
- Test Features:
  - Filter by status (Pending, In Preparation, etc.)
  - Sort by different criteria
  - Search functionality
  - Status Updates: Change order status using dropdown
- Expected Result:
  - All orders display correctly
  - Filters work properly
  - Status updates reflect immediately
  - Search functionality works

#### Test 2.4: Supplier Communication Component
- Click "Suppliers" in navigation
- Select an Order from the left panel
- Test Messaging:
  - Send a message to supplier
  - Verify message appears in chat
  - Check for auto-responses (simulated)
- Expected Result:
  - Order list loads in left panel
  - Chat interface opens for selected order
  - Messages send successfully
  - Auto-responses appear after 2 seconds

#### Test 2.5: Accounting Component
- Click "Accounting" in navigation
- Verify Financial Data:
  - Total revenue calculation
  - Total costs calculation
  - Profit margin calculation
- Test Detailed View:
  - Click "Show Details" button
  - Verify order breakdown table
  - Check export buttons
- Expected Result:
  - Financial calculations are correct
  - Status distribution shows properly
  - Top products list displays
  - Detailed table shows all orders

### 3. Responsive Design Testing

#### Test 3.1: Mobile Responsiveness
- Open browser developer tools (F12)
- Toggle device toolbar
- Test on different screen sizes:
  - iPhone (375px)
  - iPad (768px)
  - Desktop (1200px)
- Expected Result:
  - Navigation adapts to mobile
  - Forms remain usable
  - Tables become scrollable
  - All components responsive

### 4. Data Flow Testing

#### Test 4.1: End-to-End Order Flow
1. Create Order: Use Order Reception form
2. Verify in Orders: Check order appears in list
3. Update Status: Change status to "In Preparation"
4. Check Dashboard: Verify statistics update
5. Send Message: Use Supplier Communication
6. Check Accounting: Verify financial data updates
- Expected Result:
  - Data flows correctly between components
  - Real-time updates work
  - All components stay synchronized

### 5. Error Handling Testing

#### Test 5.1: Form Validation Test
- Go to "New Order"
- Try submitting empty form
- Try invalid phone number: 123
- Try past delivery date: 2020-01-01
- Expected Result: Proper error messages appear for each validation

#### Test 5.2: Network Error Test
- Stop the backend server (Ctrl+C in backend terminal)
- Try to create a new order
- Restart backend and try again
- Expected Result: Error message appears, then works after restart

### 6. Performance Testing

#### Test 6.1: Performance Checks
- Page Load Times: Check initial load speed
- API Response Times: Monitor network tab
- Memory Usage: Check browser dev tools
- Large Data Sets: Create multiple orders
- Expected Result:
  - Fast initial load (< 3 seconds)
  - API responses under 500ms
  - No memory leaks
  - Handles multiple orders smoothly

## Common Issues & Solutions

1. **Module not found errors**: Run `npm install` in frontend folder
2. **Port already in use**: Kill processes using ports 3000 or 8000
3. **Database errors**: Run `python manage.py migrate` in backend
4. **CORS errors**: Check backend is running on port 8000
5. **Blank page**: Check browser console for JavaScript errors

## Success Criteria

The system is considered fully functional when:
- ✅ All 12 test categories pass
- ✅ No critical errors in console
- ✅ All features work as expected
- ✅ System is ready for Phase 2 development

## Next Steps

Once testing is complete and everything works properly:
1. Phase 2: AI/NLP integration for order analysis
2. Phase 3: Production deployment and advanced features