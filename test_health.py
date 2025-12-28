#!/usr/bin/env python
"""
Quick script to test if the health endpoint is working
"""
import requests
import json

def test_health_endpoint(base_url="http://127.0.0.1:8000"):
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{base_url}/health/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("\n✅ Health check endpoint is working!")
            return True
        else:
            print("\n❌ Health check endpoint returned an error")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running.")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing ReCra Backend Health Endpoint...\n")
    test_health_endpoint()
