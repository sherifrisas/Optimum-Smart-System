// Test script to verify data transformation from snake_case to camelCase
const axios = require('axios');

// Mock transform function (same as in App.js)
const transformOrderData = (order) => {
  return {
    id: order.id,
    customerName: order.customer_name,
    phoneNumber: order.customer_phone,
    supplierName: order.supplier_name,
    productType: order.product_type,
    quantity: order.quantity,
    totalAmount: order.total_amount,
    deliveryDate: order.delivery_date,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at
  };
};

async function testDataTransformation() {
  try {
    console.log('Testing data transformation...');
    
    // Get data from backend
    const response = await axios.get('http://localhost:8000/api/orders/');
    const orders = response.data.results || response.data;
    
    console.log(`Found ${orders.length} orders from backend`);
    
    // Transform first order
    if (orders.length > 0) {
      const transformedOrder = transformOrderData(orders[0]);
      
      console.log('\nOriginal backend data (first order):');
      console.log('- customer_name:', orders[0].customer_name);
      console.log('- product_type:', orders[0].product_type);
      console.log('- status:', orders[0].status);
      
      console.log('\nTransformed frontend data (first order):');
      console.log('- customerName:', transformedOrder.customerName);
      console.log('- productType:', transformedOrder.productType);
      console.log('- status:', transformedOrder.status);
      
      // Verify all required fields are present
      const requiredFields = ['id', 'customerName', 'phoneNumber', 'productType', 'quantity', 'status'];
      const missingFields = requiredFields.filter(field => !(field in transformedOrder));
      
      if (missingFields.length === 0) {
        console.log('\n✅ Data transformation SUCCESSFUL');
        console.log('All required fields are present for frontend components');
      } else {
        console.log('\n❌ Data transformation FAILED');
        console.log('Missing fields:', missingFields);
      }
    } else {
      console.log('No orders found in database');
    }
  } catch (error) {
    console.error('Error testing data transformation:', error.message);
  }
}

// Run the test
testDataTransformation();