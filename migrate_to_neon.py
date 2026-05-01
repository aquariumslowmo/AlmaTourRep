"""
Setup verification: Check backend + Neon readiness
Backend is already running at http://127.0.0.1:8000 with seed data in Neon
"""
import requests
import sys
from typing import Optional

BACKEND_URL = "http://127.0.0.1:8000"

ADMIN_EMAIL = "admin@almatour.kz"
ADMIN_PASSWORD = "admin123"
GUIDE_EMAIL = "guide@almatour.kz"
GUIDE_PASSWORD = "guide123"
TOURIST_EMAIL = "tourist@almatour.kz"
TOURIST_PASSWORD = "tourist123"



def get_auth_token(email: str, password: str) -> Optional[str]:
    """Get JWT token from backend."""
    try:
        r = requests.post(f"{BACKEND_URL}/auth/login", json={"email": email, "password": password}, timeout=10)
        if r.status_code == 200:
            return r.json().get("token")
        print(f"  Login failed: {r.status_code}")
        return None
    except Exception as e:
        print(f"  Error: {e}")
        return None


def verify_backend():
    """Verify backend is running with seed data."""
    print("\n=== Verifying Backend ===")
    print(f"URL: {BACKEND_URL}")
    
    # Test login
    print("Testing admin login...")
    token = get_auth_token("admin@almatour.kz", "admin123")
    if not token:
        print("❌ Cannot authenticate. Backend not running or seed data missing.")
        return False
    print("✅ Login successful")
    
    # Check tours
    print("Checking /tours endpoint...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(f"{BACKEND_URL}/tours", headers=headers, timeout=10)
        if resp.status_code == 200:
            tours = resp.json().get("tours", [])
            print(f"✅ Tours endpoint OK: {len(tours)} tours in Neon PostgreSQL")
            for t in tours[:3]:
                print(f"   - {t['title']} (${t['price']})")
            return True
        else:
            print(f"❌ /tours returned {resp.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("=" * 70)
    print("AlmaTour - Backend & Neon Readiness Check")
    print("=" * 70)
    
    if not verify_backend():
        print("\n❌ Setup incomplete")
        print("\nEnsure backend is running:")
        print("  cd C:\\Users\\aiblb\\PycharmProjects\\AlmaTourBack")
        print("  python -m uvicorn app.main:app --reload")
        sys.exit(1)
    
    print("\n" + "=" * 70)
    print("✅ ALL SYSTEMS READY!")
    print("=" * 70)
    
    print("\n📍 Next: Open frontend in browser")
    print("  1. In new PowerShell window:")
    print("     cd C:\\Users\\aiblb\\PycharmProjects\\AlmaTourRep\\src")
    print("     python -m http.server 8001")
    print("\n  2. Open browser: http://127.0.0.1:8001/auth.html")
    print("\n  3. Login with:")
    print("     Email: admin@almatour.kz")
    print("     Pass:  admin123")
    print("\n  Or try tourist account:")
    print("     Email: tourist@almatour.kz")
    print("     Pass:  tourist123")


if __name__ == "__main__":
    main()

