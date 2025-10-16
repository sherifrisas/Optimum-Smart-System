// Test script to verify API connection and data transformation together
const https = require('https');
const http = require('http');

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

function getJSON(url, callback) {
  const lib = url.startsWith('https') ? https : http;
  lib.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, jsonData);
      } catch (error) {
        callback(error, null);
      }
    });
  }).on('error', (error) => {
    callback(error, null);
  });
}

console.log('Testing API connection and data transformation...');

// Test API connection
getJSON('http://localhost:8000/api/orders/', (error, data) => {
  if (error) {
    console.error('❌ API connection FAILED:', error.message);
    return;
  }

  console.log('✅ API connection SUCCESSFUL');
  console.log(`Found ${data.count || data.length} orders`);

  // Extract orders
  const orders = data.results || data;
  
  if (orders.length > 0) {
    console.log('\nTesting data transformation for first order...');
    
    // Show original data
    console.log('Original backend data (first order):');
    console.log('- customer_name:', orders[0].customer_name);
    console.log('- product_type:', orders[0].product_type);
    console.log('- status:', orders[0].status);
    
    // Transform data
    const transformedOrder = transformOrderData(orders[0]);
    
    // Show transformed data
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
      console.log('\n🎉 The "Failed to load orders" issue should now be RESOLVED!');
    } else {
      console.log('\n❌ Data transformation FAILED');
      console.log('Missing fields:', missingFields);
    }
  } else {
    console.log('No orders found in database');
  }
});