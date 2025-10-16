# Detailed Testing Procedure for Optimum Smart System

## Overview
This document provides step-by-step instructions for testing all components of the Optimum Smart System to ensure proper functionality.

## Prerequisites
1. Python 3.8+
2. Node.js 14+
3. Two terminal/command prompt windows
4. Web browser (Chrome recommended)

## System Startup

### Step 1: Start Backend Server
1. Open Command Prompt or PowerShell
2. Navigate to project root directory
3. Change to backend directory:
   ```
   cd optimum-backend
   ```
4. Activate virtual environment:
   ```
   venv\Scripts\activate
   ```
5. Start Django server:
   ```
   python manage.py runserver
   ```
6. Verify server is running by checking for:
   ```
   Starting development server at http://127.0.0.1:8000/
   ```

### Step 2: Start Frontend Server
1. Open a NEW Command Prompt or PowerShell window
2. Navigate to project root directory
3. Change to frontend directory:
   ```
   cd optimum-frontend
   ```
4. Install dependencies (if not already installed):
   ```
   npm install
   ```
5. Start React development server:
   ```
   npm start
   ```
6. Browser should automatically open to http://localhost:3000

## Component Testing

### 1. Dashboard Testing

#### Test 1.1: Dashboard Loading
1. Navigate to http://localhost:3000
2. Verify:
   - Header displays "Optimum Smart System"
   - Navigation menu is visible on left
   - Dashboard content loads without errors
   - Statistics cards display (Total Orders, Total Items, etc.)

#### Test 1.2: Statistics Display
1. Check that statistics show:
   - Total Orders: Should display 4 (from seeded data)
   - Total Items: Should display 5 (sum of quantities from seeded data)
   - Pending Orders: Should display 1
   - Upcoming Deliveries: Should display 4

#### Test 1.3: Status Distribution
1. Scroll to "Order Status Distribution" section
2. Verify:
   - Status bars display with appropriate widths
   - Colors match status types (Pending, In Preparation, etc.)

#### Test 1.4: Recent Orders
1. Scroll to "Recent Orders" section
2. Verify:
   - Shows 4 recent orders from seeded data
   - Customer names match seeded data
   - Product types match seeded data

#### Test 1.5: Upcoming Deliveries
1. Scroll to "Upcoming Deliveries" section
2. Verify:
   - Shows upcoming deliveries from seeded data
   - Dates are formatted correctly

### 2. Order Reception Testing

#### Test 2.1: Navigation to New Order
1. Click "New Order" in left navigation menu
2. Verify:
   - Order Reception form loads
   - Page title shows "New Order Reception"

#### Test 2.2: Form Validation
1. Try submitting empty form
2. Verify:
   - Error messages appear for all required fields
   - Form does not submit

#### Test 2.3: Invalid Data Entry
1. Enter invalid phone number: "123"
2. Enter past delivery date: "2020-01-01"
3. Try submitting form
4. Verify:
   - Appropriate error messages appear
   - Form does not submit

#### Test 2.4: Valid Order Creation
1. Fill form with valid data:
   - Customer Name: "Test Customer"
   - Phone Number: "+20 100 999 8888"
   - Product Type: "Test Product"
   - Quantity: "2"
   - Delivery Date: Future date (e.g., 2025-12-25)
2. Click "Create Order"
3. Verify:
   - Form validates correctly
   - Order created successfully
   - Redirected to Orders page
   - New order appears in list

### 3. Order List Testing

#### Test 3.1: Navigation to Orders
1. Click "Orders" in left navigation menu
2. Verify:
   - Order List page loads
   - Shows all orders (5 total after creating new order)

#### Test 3.2: Status Filtering
1. Use "Filter by Status" dropdown
2. Select "Pending"
3. Verify:
   - Only pending orders display
4. Test other status filters
5. Verify:
   - Each filter works correctly

#### Test 3.3: Sorting
1. Use "Sort by" dropdown
2. Test each sorting option:
   - Date Created
   - Delivery Date
   - Customer Name
   - Product Type
3. Verify:
   - Orders sort correctly for each option

#### Test 3.4: Sort Order
1. Use "Order" dropdown
2. Switch between "Newest First" and "Oldest First"
3. Verify:
   - Order of items changes appropriately

#### Test 3.5: Status Updates
1. Find an order in the list
2. Use the status dropdown for that order
3. Change status to "In Preparation"
4. Verify:
   - Status updates immediately
   - Visual indicator changes

### 4. Supplier Communication Testing

#### Test 4.1: Navigation to Suppliers
1. Click "Suppliers" in left navigation menu
2. Verify:
   - Supplier Communication page loads
   - Shows list of orders on left panel

#### Test 4.2: Order Selection
1. Click on any order in the left panel
2. Verify:
   - Chat panel updates with order information
   - Supplier details display correctly
   - Initial system message appears

#### Test 4.3: Message Sending
1. Type message in text area: "Hello, please confirm this order"
2. Click "Send" button
3. Verify:
   - Message appears in chat as outgoing message
   - Text area clears
   - Send button disables during sending

#### Test 4.4: Supplier Response
1. Wait 2 seconds after sending message
2. Verify:
   - Automated supplier response appears
   - Response shows as incoming message
   - Timestamps display correctly

### 5. Accounting Testing

#### Test 5.1: Navigation to Accounting
1. Click "Accounting" in left navigation menu
2. Verify:
   - Accounting page loads
   - Financial overview cards display

#### Test 5.2: Financial Overview
1. Check financial cards:
   - Total Revenue
   - Total Costs
   - Net Profit
   - Profit Margin
2. Verify:
   - Values calculate correctly based on orders
   - Currency formatting is correct

#### Test 5.3: Status Distribution
1. Scroll to "Order Status Distribution" section
2. Verify:
   - Shows breakdown of orders by status
   - Status bars display with correct proportions

#### Test 5.4: Top Products
1. Scroll to "Top Products by Quantity" section
2. Verify:
   - Shows top 5 products by quantity sold
   - Rankings display correctly

#### Test 5.5: Detailed View
1. Click "Show Details" button
2. Verify:
   - Detailed order table appears
   - Shows all orders with revenue/cost/profit breakdown
   - Table is properly formatted

#### Test 5.6: Export Functions
1. Click "Export to Excel" button
2. Click "Generate Report" button
3. Verify:
   - Buttons are clickable
   - (Note: Actual export functionality would need backend implementation)

### 6. Responsive Design Testing

#### Test 6.1: Mobile View
1. Press F12 to open Developer Tools
2. Click device toggle icon (📱)
3. Select mobile device (e.g., iPhone 12 Pro)
4. Verify:
   - Navigation becomes horizontal
   - Layout adapts to smaller screen
   - All components remain usable

#### Test 6.2: Tablet View
1. In Developer Tools, select tablet device (e.g., iPad)
2. Verify:
   - Layout adjusts appropriately
   - Components resize correctly
   - No overlapping elements

### 7. Data Flow Testing

#### Test 7.1: End-to-End Flow
1. Create new order (Order Reception)
2. Navigate to Orders page
3. Verify new order appears
4. Update order status
5. Navigate to Dashboard
6. Verify statistics update
7. Navigate to Accounting
8. Verify financial data updates

#### Test 7.2: Real-time Updates
1. Open two browser tabs
2. In first tab, update an order status
3. Switch to second tab
4. Verify:
   - Order status updates without refresh
   - Data stays synchronized

### 8. Error Handling Testing

#### Test 8.1: Network Error Simulation
1. Stop backend server (Ctrl+C in backend terminal)
2. Try to create new order
3. Verify:
   - Error message displays
   - User interface remains functional
4. Restart backend server
5. Try creating order again
6. Verify:
   - Order creates successfully

#### Test 8.2: Form Validation
1. Try various invalid inputs in forms
2. Verify:
   - Appropriate error messages display
   - Form submission prevents with invalid data

## Backend API Testing

### Test API Endpoints
1. Open browser to http://localhost:8000/api/orders/
2. Verify:
   - Returns JSON data with orders
   - Status code 200
3. Test other endpoints:
   - http://localhost:8000/api/customers/
   - http://localhost:8000/api/suppliers/
4. Verify:
   - All return valid JSON data

### Test Admin Panel
1. Navigate to http://localhost:8000/admin/
2. Login with:
   - Username: admin
   - Password: admin123
3. Verify:
   - Login successful
   - Can view/edit orders, customers, suppliers

## Performance Testing

### Test Page Load Times
1. Refresh main dashboard page
2. Check Network tab in Developer Tools
3. Verify:
   - Page loads within 3 seconds
   - No major performance bottlenecks

### Test API Response Times
1. Monitor API calls in Network tab
2. Verify:
   - API responses under 500ms
   - No timeout errors

## Success Criteria

Mark each test as complete when verified:

### Frontend Components
- [ ] Dashboard loads and displays data correctly
- [ ] Order Reception form validates and creates orders
- [ ] Order List filters, sorts, and updates status
- [ ] Supplier Communication sends/receives messages
- [ ] Accounting displays financial data and breakdowns
- [ ] Responsive design works on all device sizes

### Backend Functionality
- [ ] API endpoints return correct data
- [ ] Admin panel accessible and functional
- [ ] Database operations work correctly

### Integration
- [ ] Data flows correctly between frontend and backend
- [ ] Real-time updates work
- [ ] Error handling works properly

### Performance
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] System handles multiple operations smoothly

## Troubleshooting Common Issues

### Issue: Module not found errors
**Solution**: Run `npm install` in frontend directory

### Issue: Port already in use
**Solution**: Kill processes using ports 3000 or 8000, or change ports in configuration

### Issue: Database errors
**Solution**: Run `python manage.py migrate` in backend directory

### Issue: CORS errors
**Solution**: Verify backend is running on port 8000 and CORS settings are correct

### Issue: Blank page
**Solution**: Check browser console for JavaScript errors and fix accordingly

## Next Steps After Successful Testing

1. Document any issues found during testing
2. Fix any identified bugs
3. Proceed to Phase 2 development (AI/NLP integration)
4. Prepare for production deployment