"""Quick API smoke test: login and fetch tours
Usage:
    python test_api.py
"""
import requests
import sys

BACKEND = "http://127.0.0.1:8000"
ADMIN = ("admin@almatour.kz", "admin123")

def main():
    print("Logging in as admin...")
    r = requests.post(f"{BACKEND}/auth/login", json={"email": ADMIN[0], "password": ADMIN[1]})
    print(r.status_code, r.text)
    if r.status_code != 200:
        print("Login failed; exit")
        sys.exit(1)
    token = r.json().get('token')
    print('Token length:', len(token))

    headers = {"Authorization": f"Bearer {token}"}
    print("Fetching /tours ...")
    r = requests.get(f"{BACKEND}/tours", headers=headers)
    print(r.status_code)
    try:
        print(r.json())
    except Exception:
        print(r.text)

if __name__ == '__main__':
    main()

