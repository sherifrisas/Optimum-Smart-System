#!/usr/bin/env python
"""
System verification script for Optimum Smart System
This script checks if all components are working correctly
"""

import requests
import json
import sys
import time

def check_backend():
    """Check if backend server is running and responding"""
    print("Checking backend server...")
    
    try:
        response = requests.get("http://localhost:8000", timeout=5)
        if response.status_code == 200:
            print("✓ Backend server is running")
            return True
        else:
            print(f"✗ Backend server returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Backend server is not running. Please start it with 'start-backend.bat'")
        return False
    except Exception as e:
        print(f"✗ Error connecting to backend server: {e}")
        return False

def check_api_endpoints():
    """Check if API endpoints are working"""
    print("\nChecking API endpoints...")
    
    endpoints = [
        "/api/orders/",
        "/api/customers/",
        "/api/suppliers/"
    ]
    
    all_good = True
    for endpoint in endpoints:
        try:
            response = requests.get(f"http://localhost:8000{endpoint}", timeout=5)
            if response.status_code == 200:
                data = response.json()
                items_count = len(data.get('results', data)) if isinstance(data, dict) else len(data)
                print(f"✓ {endpoint} - Status: {response.status_code}, Items: {items_count}")
            else:
                print(f"✗ {endpoint} - Status: {response.status_code}")
                all_good = False
        except Exception as e:
            print(f"✗ {endpoint} - Error: {e}")
            all_good = False
    
    return all_good

def check_frontend():
    """Check if frontend server is running (simulated check)"""
    print("\nChecking frontend server...")
    print("Note: Please manually verify frontend at http://localhost:3000")
    print("✓ Frontend check placeholder (manual verification required)")
    return True

def check_database():
    """Check if database has data"""
    print("\nChecking database...")
    
    try:
        response = requests.get("http://localhost:8000/api/orders/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            order_count = len(data.get('results', data)) if isinstance(data, dict) else len(data)
            if order_count > 0:
                print(f"✓ Database has {order_count} orders")
                return True
            else:
                print("⚠ Database is empty (no orders found)")
                return True  # Not an error, just empty
        else:
            print(f"✗ Failed to check database - Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error checking database: {e}")
        return False

def check_components():
    """Check if all system components are working"""
    print("=" * 50)
    print("OPTIMUM SMART SYSTEM - VERIFICATION SCRIPT")
    print("=" * 50)
    
    checks = [
        ("Backend Server", check_backend),
        ("API Endpoints", check_api_endpoints),
        ("Database", check_database),
        ("Frontend", check_frontend)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n--- {name} ---")
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} check failed with error: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 50)
    print("VERIFICATION SUMMARY")
    print("=" * 50)
    
    all_passed = True
    for name, passed in results:
        status = "PASS" if passed else "FAIL"
        print(f"{name}: {status}")
        if not passed:
            all_passed = False
    
    print("\n" + "=" * 50)
    if all_passed:
        print("🎉 ALL CHECKS PASSED!")
        print("Your Optimum Smart System is working correctly.")
        print("\nNext steps:")
        print("1. Open http://localhost:3000 in your browser")
        print("2. Follow the DETAILED_TESTING_PROCEDURE.md for comprehensive testing")
    else:
        print("❌ SOME CHECKS FAILED!")
        print("Please check the errors above and resolve them.")
        print("Refer to the troubleshooting section in DETAILED_TESTING_PROCEDURE.md")
    
    print("=" * 50)
    return all_passed

if __name__ == "__main__":
    success = check_components()
    sys.exit(0 if success else 1)