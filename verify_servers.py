#!/usr/bin/env python
"""
Simple verification script to check if servers are running
"""

import requests
import time

def check_servers():
    print("Checking if Optimum Smart System servers are running...")
    print("=" * 50)
    
    # Check backend server
    print("1. Checking Backend Server (http://localhost:8000)...")
    try:
        response = requests.get("http://localhost:8000", timeout=5)
        if response.status_code == 404:
            print("   ✓ Backend server is running (404 is expected for root URL)")
        else:
            print(f"   ? Backend server returned status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ✗ Backend server is not running")
    except Exception as e:
        print(f"   ✗ Error checking backend server: {e}")
    
    # Check backend API
    print("2. Checking Backend API (http://localhost:8000/api/orders/)...")
    try:
        response = requests.get("http://localhost:8000/api/orders/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Backend API is working - Found {len(data.get('results', []))} orders")
        else:
            print(f"   ✗ Backend API returned status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ✗ Backend API is not accessible")
    except Exception as e:
        print(f"   ✗ Error checking backend API: {e}")
    
    # Check frontend server
    print("3. Checking Frontend Server (http://localhost:3000)...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("   ✓ Frontend server is running")
        else:
            print(f"   ? Frontend server returned status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ✗ Frontend server is not running")
    except Exception as e:
        print(f"   ✗ Error checking frontend server: {e}")
    
    print("\n" + "=" * 50)
    print("Server check completed!")

if __name__ == "__main__":
    check_servers()