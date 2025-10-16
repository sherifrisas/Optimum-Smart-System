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
    
    # Test API endpoints
    print("Testing API endpoints...")
    
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
                print(f"✓ {endpoint} - Status: {response.status_code}")
            else:
                print(f"✗ {endpoint} - Status: {response.status_code}")
        except Exception as e:
            print(f"✗ {endpoint} - Error: {e}")
    
    print("\n" + "=" * 40)
    print("Backend API testing completed!")

if __name__ == "__main__":
    test_backend()