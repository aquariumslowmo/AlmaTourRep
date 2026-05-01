"""
Seed script for Neon PostgreSQL database
Creates tables and inserts initial data (admin, guide, tourist users + 5 sample tours)
"""

import sys
import os
import hashlib
from datetime import datetime

# Connection string from Neon (update if needed)
DATABASE_URL = "postgresql://neondb_owner:npg_RYUA5FsG2Luj@ep-noisy-dust-alwalayv-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

try:
    import psycopg2
    from psycopg2 import sql
except ImportError:
    print("❌ psycopg2 not installed. Installing...")
    os.system("pip install psycopg2-binary")
    import psycopg2
    from psycopg2 import sql

def hash_password(password: str) -> str:
    """Hash password using SHA256 (same as backend)"""
    return hashlib.sha256(password.encode()).hexdigest()

def seed_database():
    """Create tables and seed data in Neon"""
    
    print("\n" + "="*60)
    print("🌱 AlmaTour - Neon Database Seeding")
    print("="*60)
    
    try:
        # Connect to Neon
        print("\n📍 Connecting to Neon PostgreSQL...")
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        print("✅ Connected to Neon")
        
        # Drop existing tables (optional - for testing)
        # Uncomment if you want to reset the database
        # print("\n🗑️  Dropping existing tables...")
        # cursor.execute("DROP TABLE IF EXISTS bookings CASCADE;")
        # cursor.execute("DROP TABLE IF EXISTS tours CASCADE;")
        # cursor.execute("DROP TABLE IF EXISTS users CASCADE;")
        # print("✅ Tables dropped")
        
        # Create users table
        print("\n📍 Creating users table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK(role IN ('tourist', 'guide', 'admin')),
                name VARCHAR(255) NOT NULL,
                region_h3 VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ users table created")
        
        # Create tours table
        print("\n📍 Creating tours table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tours (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                guide_id INTEGER REFERENCES users(id),
                price NUMERIC(10, 2) NOT NULL,
                capacity INTEGER NOT NULL,
                seats_available INTEGER NOT NULL,
                lat NUMERIC(10, 8) NOT NULL,
                lng NUMERIC(10, 8) NOT NULL,
                h3_index VARCHAR(255) NOT NULL,
                h3_region VARCHAR(255) NOT NULL,
                location_name VARCHAR(255) NOT NULL,
                schedule_date DATE NOT NULL,
                duration_hours NUMERIC(5, 2),
                status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'completed')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ tours table created")
        
        # Create bookings table
        print("\n📍 Creating bookings table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                tour_id INTEGER NOT NULL REFERENCES tours(id),
                tourist_id INTEGER NOT NULL REFERENCES users(id),
                seats_booked INTEGER NOT NULL DEFAULT 1,
                status VARCHAR(50) DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled')),
                total_price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ bookings table created")
        
        # Create audit_log table
        print("\n📍 Creating audit_log table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_log (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                user_email VARCHAR(255),
                action VARCHAR(255) NOT NULL,
                entity VARCHAR(255) NOT NULL,
                entity_id INTEGER,
                details TEXT,
                ip_address VARCHAR(255) DEFAULT '127.0.0.1',
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ audit_log table created")
        
        # Create h3_region_analytics table
        print("\n📍 Creating h3_region_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS h3_region_analytics (
                h3_region VARCHAR(255) PRIMARY KEY,
                resolution INTEGER DEFAULT 5,
                total_tours INTEGER DEFAULT 0,
                total_bookings INTEGER DEFAULT 0,
                total_revenue NUMERIC(10, 2) DEFAULT 0,
                avg_rating NUMERIC(3, 1) DEFAULT 0.0,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        print("✅ h3_region_analytics table created")
        
        # Seed users
        print("\n📍 Seeding users...")
        
        admin_hash = hash_password("admin123")
        guide_hash = hash_password("guide123")
        tourist_hash = hash_password("tourist123")
        
        # Try to insert, ignore if already exists
        cursor.execute("""
            INSERT INTO users (email, password_hash, role, name) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT(email) DO NOTHING
        """, ("admin@almatour.kz", admin_hash, "admin", "System Admin"))
        
        cursor.execute("""
            INSERT INTO users (email, password_hash, role, name, region_h3) 
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT(email) DO NOTHING
        """, ("guide@almatour.kz", guide_hash, "guide", "Aidana Bekova", "872830977bcffff"))
        
        cursor.execute("""
            INSERT INTO users (email, password_hash, role, name, region_h3) 
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT(email) DO NOTHING
        """, ("tourist@almatour.kz", tourist_hash, "tourist", "James Smith", "872831d95c0ffff"))
        
        print("✅ Users seeded (admin, guide, tourist)")
        
        # Seed tours (get guide_id first)
        print("\n📍 Seeding tours...")
        
        cursor.execute("SELECT id FROM users WHERE email = %s", ("guide@almatour.kz",))
        guide_id = cursor.fetchone()[0]
        
        TOURS = [
            ("Shymbulak Mountain Tour", "Cable car ride & ski resort visit", guide_id, 45.0, 10, 10, 43.1393, 77.0785, "875283473c7ffff", "872830977bcffff", "Shymbulak, Almaty", "2026-03-15", 2.0),
            ("Medeu Ice Rink Experience", "World's highest skating rink outdoor visit", guide_id, 25.0, 20, 20, 43.1560, 77.0572, "8752839a1f7ffff", "872830977bcffff", "Medeu, Almaty", "2026-03-15", 2.0),
            ("Kok-Tobe Cable Car & View", "Panoramic city views from Kok-Tobe Hill", guide_id, 30.0, 15, 15, 43.2335, 76.9720, "8752839535fffff", "872830977bcffff", "Kok-Tobe, Almaty", "2026-03-15", 2.0),
            ("Almaty Green Bazaar Food Tour", "Taste local cuisine at the historic bazaar", guide_id, 20.0, 12, 12, 43.2551, 76.9440, "8752830517fffff", "872830977bcffff", "Green Bazaar, Almaty", "2026-03-15", 2.0),
            ("Charyn Canyon Day Trip", "Spectacular canyon 200km from Almaty", guide_id, 80.0, 8, 8, 43.3503, 79.0700, "8728318cf8fffff", "872830977bcffff", "Charyn Canyon", "2026-03-15", 8.0),
            ("Kaindy Lake Adventure", "Beautiful alpine lake with submerged forest", guide_id, 60.0, 10, 10, 43.4703, 77.7800, "872831d95c0ffff", "872830977bcffff", "Kaindy Lake", "2026-03-15", 6.0),
            ("Big Almaty Lake Trek", "Turquoise mountain lake with scenic views", guide_id, 35.0, 15, 15, 43.0880, 77.1234, "872831ab12fffff", "872830977bcffff", "Big Almaty Lake", "2026-03-15", 3.0),
            ("Turgen Gorge Safari", "Wildlife observation and gorge exploration", guide_id, 75.0, 8, 8, 43.5503, 77.8800, "872831c34dffff", "872830977bcffff", "Turgen Gorge", "2026-03-15", 7.0),
            ("Altyn-Emel National Park", "Desert and mountain landscapes at the park", guide_id, 95.0, 6, 6, 44.5000, 79.3500, "8728300156fffff", "872830977bcffff", "Altyn-Emel", "2026-03-15", 10.0),
            ("Chyn River Kayaking", "Whitewater kayaking adventure", guide_id, 55.0, 12, 12, 43.4200, 78.2100, "872831e56fffff", "872830977bcffff", "Chyn River", "2026-03-15", 4.0),
            ("Issyk Lake Crater Tour", "Beautiful crater lake surrounded by mountains", guide_id, 40.0, 14, 14, 43.3100, 77.4500, "872831f78fffff", "872830977bcffff", "Issyk Lake", "2026-03-15", 5.0),
            ("Turanaul Valley Hike", "Scenic valley with streams and forests", guide_id, 50.0, 10, 10, 43.6000, 77.9000, "872832012fffff", "872830977bcffff", "Turanaul Valley", "2026-03-15", 5.5),
            ("Alma-Arasan Gorge", "Beautiful gorge with waterfalls", guide_id, 32.0, 16, 16, 43.2100, 76.8234, "872832234fffff", "872830977bcffff", "Alma-Arasan", "2026-03-15", 3.5),
            ("Assy Plateau", "High altitude plateau with unique ecosystem", guide_id, 70.0, 9, 9, 43.5800, 77.1234, "872832456fffff", "872830977bcffff", "Assy Plateau", "2026-03-15", 8.5),
            ("Panfilov Park City Tour", "Historic park and Ascension Cathedral", guide_id, 18.0, 20, 20, 43.2380, 76.9405, "872832678fffff", "872830977bcffff", "Panfilov Park", "2026-03-15", 2.5),
            ("Buttercup Gorge Photo Tour", "Photography hotspot with landscapes", guide_id, 48.0, 8, 8, 43.2900, 77.2100, "87283289afffff", "872830977bcffff", "Buttercup Gorge", "2026-03-15", 4.0),
        ]
        
        for tour in TOURS:
            cursor.execute("""
                INSERT INTO tours 
                (title, description, guide_id, price, capacity, seats_available, lat, lng, 
                 h3_index, h3_region, location_name, schedule_date, duration_hours, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, tour + ("active",))
        
        conn.commit()
        print(f"✅ {len(TOURS)} tours seeded")
        
        # Verify data
        print("\n📍 Verifying data...")
        
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"  Users: {user_count}")
        
        cursor.execute("SELECT COUNT(*) FROM tours")
        tour_count = cursor.fetchone()[0]
        print(f"  Tours: {tour_count}")
        
        cursor.execute("SELECT COUNT(*) FROM bookings")
        booking_count = cursor.fetchone()[0]
        print(f"  Bookings: {booking_count}")
        
        print("\n" + "="*60)
        print("✅ Database seeding complete!")
        print("="*60)
        
        print("\n🧪 Test credentials:")
        print("  Admin:   admin@almatour.kz / admin123")
        print("  Guide:   guide@almatour.kz / guide123")
        print("  Tourist: tourist@almatour.kz / tourist123")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    seed_database()

