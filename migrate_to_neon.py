"""
Migration script: SQLite → Neon PostgreSQL
Reads from local almatour.db and populates the Neon backend via API calls
"""

import sqlite3
import requests
import json
import os
import sys
from typing import Optional

# ─────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────
NEON_API_URL = "postgresql://neondb_owner:npg_RYUA5FsG2Luj@ep-noisy-dust-alwalayv-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
BACKEND_URL = "http://localhost:8000"  # Change to production URL when deploying
LOCAL_DB = "src/almatour.db"

# Default credentials for seeding
ADMIN_EMAIL = "admin@almatour.kz"
ADMIN_PASSWORD = "admin123"
GUIDE_EMAIL = "guide@almatour.kz"
GUIDE_PASSWORD = "guide123"
TOURIST_EMAIL = "tourist@almatour.kz"
TOURIST_PASSWORD = "tourist123"


# ─────────────────────────────────────────────
# Database Connection
# ─────────────────────────────────────────────
def get_local_db():
    """Connect to local SQLite database."""
    if not os.path.exists(LOCAL_DB):
        print(f"❌ Local database not found: {LOCAL_DB}")
        sys.exit(1)
    conn = sqlite3.connect(LOCAL_DB)
    conn.row_factory = sqlite3.Row
    return conn


# ─────────────────────────────────────────────
# API Helpers
# ─────────────────────────────────────────────
def get_auth_token(email: str, password: str) -> Optional[str]:
    """Authenticate and get JWT token."""
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": email, "password": password},
            timeout=10
        )
        if response.status_code == 200:
            return response.json()["token"]
        else:
            print(f"❌ Login failed for {email}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Failed to authenticate: {e}")
        return None


def create_tour(token: str, tour_data: dict) -> Optional[int]:
    """Create a tour via API and return tour_id."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(
            f"{BACKEND_URL}/tours",
            json=tour_data,
            headers=headers,
            timeout=10
        )
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Tour created: {tour_data['title']} (ID: {result.get('id')})")
            return result.get("id")
        else:
            print(f"❌ Failed to create tour {tour_data['title']}: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating tour: {e}")
        return None


def create_booking(token: str, booking_data: dict) -> Optional[int]:
    """Create a booking via API."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(
            f"{BACKEND_URL}/bookings",
            json=booking_data,
            headers=headers,
            timeout=10
        )
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Booking created (ID: {result.get('booking_id')})")
            return result.get("booking_id")
        else:
            print(f"❌ Failed to create booking: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error creating booking: {e}")
        return None


# ─────────────────────────────────────────────
# Migration Functions
# ─────────────────────────────────────────────
def migrate_tours(admin_token: str, db: sqlite3.Connection):
    """Migrate all tours from SQLite to Neon."""
    print("\n📍 Migrating tours...")
    
    tours = db.execute("SELECT * FROM tours WHERE status='active'").fetchall()
    print(f"Found {len(tours)} active tours to migrate")
    
    tour_id_map = {}  # Map local IDs to remote IDs
    
    for tour in tours:
        tour_data = {
            "title": tour["title"],
            "description": tour["description"] or "",
            "price": float(tour["price"]),
            "capacity": tour["capacity"],
            "lat": tour["lat"],
            "lng": tour["lng"],
            "location_name": tour["location_name"],
            "schedule_date": tour["schedule_date"],
            "duration_hours": tour["duration_hours"] or 2.0,
        }
        
        remote_id = create_tour(admin_token, tour_data)
        if remote_id:
            tour_id_map[tour["id"]] = remote_id
    
    print(f"✅ Migrated {len(tour_id_map)}/{len(tours)} tours")
    return tour_id_map


def migrate_bookings(tourist_token: str, tourist_id: int, db: sqlite3.Connection, tour_id_map: dict):
    """Migrate bookings from SQLite to Neon."""
    print("\n📍 Migrating bookings...")
    
    bookings = db.execute(
        "SELECT * FROM bookings WHERE tourist_id=?",
        (tourist_id,)
    ).fetchall()
    print(f"Found {len(bookings)} bookings to migrate")
    
    successful = 0
    for booking in bookings:
        local_tour_id = booking["tour_id"]
        remote_tour_id = tour_id_map.get(local_tour_id)
        
        if not remote_tour_id:
            print(f"⚠️  Skipping booking: tour {local_tour_id} not found in map")
            continue
        
        booking_data = {
            "tour_id": remote_tour_id,
            "seats": booking["seats_booked"],
        }
        
        booking_id = create_booking(tourist_token, booking_data)
        if booking_id:
            successful += 1
    
    print(f"✅ Migrated {successful}/{len(bookings)} bookings")


# ─────────────────────────────────────────────
# Main Migration Flow
# ─────────────────────────────────────────────
def main():
    print("=" * 60)
    print("🚀 AlmaTour Migration: SQLite → Neon PostgreSQL")
    print("=" * 60)
    
    # 1. Connect to local database
    print("\n1️⃣  Connecting to local SQLite database...")
    db = get_local_db()
    print("✅ Connected to local database")
    
    # 2. Authenticate as admin (for creating tours)
    print("\n2️⃣  Authenticating as admin...")
    admin_token = get_auth_token(ADMIN_EMAIL, ADMIN_PASSWORD)
    if not admin_token:
        print("❌ Failed to authenticate as admin. Make sure the backend is running.")
        sys.exit(1)
    print("✅ Admin authenticated")
    
    # 3. Migrate tours
    tour_id_map = migrate_tours(admin_token, db)
    
    # 4. Authenticate as tourist (for creating bookings)
    print("\n3️⃣  Authenticating as tourist...")
    tourist_token = get_auth_token(TOURIST_EMAIL, TOURIST_PASSWORD)
    if not tourist_token:
        print("⚠️  Could not authenticate as tourist. Skipping bookings migration.")
    else:
        # Get local tourist_id
        tourist_row = db.execute(
            "SELECT id FROM users WHERE email=?",
            (TOURIST_EMAIL,)
        ).fetchone()
        
        if tourist_row:
            migrate_bookings(tourist_token, tourist_row["id"], db, tour_id_map)
    
    db.close()
    
    print("\n" + "=" * 60)
    print("✅ Migration complete!")
    print("=" * 60)
    print("\n📝 Next steps:")
    print("1. Update API_URL in src/config.js to match your backend URL")
    print("2. Images will need to be uploaded separately to the backend")
    print("3. Update tours with image URLs once available")
    print("=" * 60)


if __name__ == "__main__":
    main()

