#!/usr/bin/env python
"""
Simple test script to verify the backend API is working correctly
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing Optimum Smart System Backend")
    print("=" * 40)
    
    # Test 1: Root endpoint
    print("Test 1: Checking if server is running...")
    try:
        response = requests.get(base_url)
        print(f"✓ Server is running - Status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("✗ Server is not running. Please start the backend server.")
        return False
    except Exception as e:
        print(f"✗ Error connecting to server: {e}")
        return False
    
    # Test 2: API endpoints
    print("\nTest 2: Testing API endpoints...")
    
    endpoints = [
        "/api/orders/",
        "/api/customers/",
        "/api/suppliers/"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                print(f"✓ {endpoint} - Status: {response.status_code}, Items: {len(data.get('results', data)) if isinstance(data, dict) else len(data)}")
            else:
                print(f"✗ {endpoint} - Status: {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint} - Error: {e}")
    
    # Test 3: Create a test order
    print("\nTest 3: Testing order creation...")
    
    # First, let's get a customer to use
    try:
        customers_response = requests.get(f"{base_url}/api/customers/")
        if customers_response.status_code == 200:
            customers = customers_response.json()
            if len(customers.get('results', customers)) > 0:
                customer = customers.get('results', customers)[0]
                customer_id = customer['id']
                print(f"✓ Found customer: {customer['name']}")
                
                # Test order creation
                order_data = {
                    "customer_id": customer_id,
                    "product_type": "Test Product",
                    "quantity": 1,
                    "unit_price": "100.00",
                    "delivery_date": "2025-12-31"
                }
                
                order_response = requests.post(
                    f"{base_url}/api/orders/",
                    json=order_data,
                    headers={"Content-Type": "application/json"}
                )
                
                if order_response.status_code == 201:
                    order = order_response.json()
                    print(f"✓ Order created successfully - Order ID: {order['id']}")
                    
                    # Test order status update
                    status_update_response = requests.patch(
                        f"{base_url}/api/orders/{order['id']}/update_status/",
                        json={"status": "in-preparation"},
                        headers={"Content-Type": "application/json"}
                    )
                    
                    if status_update_response.status_code == 200:
                        print("✓ Order status updated successfully")
                    else:
                        print(f"✗ Failed to update order status - Status: {status_update_response.status_code}")
                else:
                    print(f"✗ Failed to create order - Status: {order_response.status_code}")
            else:
                print("✗ No customers found in database")
        else:
            print(f"✗ Failed to get customers - Status: {customers_response.status_code}")
    except Exception as e:
        print(f"✗ Error during order creation test: {e}")
    
    print("\n" + "=" * 40)
    print("Backend testing completed!")
    return True

if __name__ == "__main__":
    test_backend()