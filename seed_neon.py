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
                slug VARCHAR(255),
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
                image_url TEXT,
                badge VARCHAR(50) DEFAULT 'Nature',
                rating NUMERIC(3, 1) DEFAULT 4.8,
                rating_count INTEGER DEFAULT 0,
                spots_left INTEGER DEFAULT 0,
                meta_text VARCHAR(255),
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
        
        # Seed showcase tours used by the Tours page
        print("\n📍 Seeding tours...")
        
        cursor.execute("SELECT id FROM users WHERE email = %s", ("guide@almatour.kz",))
        guide_id = cursor.fetchone()[0]
        
        TOURS = [
            {"slug": "kolsay", "title": "Kolsay Lake", "description": "Experience the stunning beauty of Kolsay Lake, one of the most picturesque destinations in Almaty region.", "price": 25000, "capacity": 5, "seats_available": 5, "lat": 43.0779, "lng": 78.3096, "location_name": "Almaty region", "duration_hours": 9, "badge": "Nature", "rating": 4.8, "rating_count": 3624, "spots_left": 5, "image_url": "/images/kolsay.jpg", "meta_text": "9 hours · Day trip"},
            {"slug": "shymbulak", "title": "Shymbulak Resort", "description": "Take the cable car to Shymbulak Resort for mountain views, snow activities, and summer hiking.", "price": 30000, "capacity": 3, "seats_available": 3, "lat": 43.1667, "lng": 77.0833, "location_name": "Almaty region", "duration_hours": 5, "badge": "Nature", "rating": 4.8, "rating_count": 4564, "spots_left": 3, "image_url": "/images/shymb.jpg", "meta_text": "Half day"},
            {"slug": "charyn", "title": "Charyn Canyon", "description": "Explore the dramatic red rock formations and scenic views of Charyn Canyon.", "price": 20000, "capacity": 7, "seats_available": 7, "lat": 43.3503, "lng": 79.0700, "location_name": "Almaty region", "duration_hours": 8, "badge": "Adventure", "rating": 4.8, "rating_count": 2897, "spots_left": 7, "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", "meta_text": "8 hours · Day trip"},
            {"slug": "kaindy", "title": "Kaindy Lake", "description": "Discover the unique Kaindy Lake with its distinctive sunken tree formations.", "price": 20000, "capacity": 9, "seats_available": 9, "lat": 43.3025, "lng": 78.4704, "location_name": "Almaty region", "duration_hours": 9, "badge": "Nature", "rating": 4.7, "rating_count": 2724, "spots_left": 9, "image_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80", "meta_text": "9 hours · Day trip"},
            {"slug": "medeu", "title": "Medeu Ice Rink", "description": "Visit the famous Medeu ice rink for skating, fresh mountain air, and great views.", "price": 25000, "capacity": 2, "seats_available": 2, "lat": 43.1680, "lng": 77.0770, "location_name": "Almaty region", "duration_hours": 6, "badge": "Adventure", "rating": 4.3, "rating_count": 534, "spots_left": 2, "image_url": "/images/medeu.jpg", "meta_text": "6 hours · Day trip"},
            {"slug": "koktobe", "title": "Kok-Tobe Hill", "description": "Enjoy panoramic views of Almaty city from Kok-Tobe Hill and its cable car ride.", "price": 18000, "capacity": 8, "seats_available": 8, "lat": 43.2382, "lng": 76.9737, "location_name": "Almaty region", "duration_hours": 4, "badge": "City tours", "rating": 4.8, "rating_count": 2364, "spots_left": 8, "image_url": "/images/kok-tobe.jpg", "meta_text": "4 hours · Day trip"},
            {"slug": "ayusai", "title": "Ayusai Waterfall", "description": "Hike to the beautiful Ayusai Waterfall during this 5-hour half-day adventure.", "price": 15000, "capacity": 6, "seats_available": 6, "lat": 43.1435, "lng": 77.0212, "location_name": "Almaty region", "duration_hours": 5, "badge": "Nature", "rating": 4.6, "rating_count": 1120, "spots_left": 6, "image_url": "/images/ayusai.jpg", "meta_text": "5 hours · Half day"},
            {"slug": "kokzhailau", "title": "Kok Zhailau Plateau", "description": "A scenic mountain plateau with panoramic views and fresh alpine air.", "price": 18000, "capacity": 8, "seats_available": 8, "lat": 43.1484, "lng": 77.1321, "location_name": "Almaty region", "duration_hours": 6, "badge": "Nature", "rating": 4.9, "rating_count": 3210, "spots_left": 8, "image_url": "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", "meta_text": "6 hours · Day trip"},
            {"slug": "almaarasan", "title": "Alma-Arasan Gorge", "description": "Relax in a beautiful gorge with waterfalls, hot springs, and mountain scenery.", "price": 12000, "capacity": 10, "seats_available": 10, "lat": 43.2108, "lng": 76.8719, "location_name": "Almaty region", "duration_hours": 4, "badge": "Nature", "rating": 4.5, "rating_count": 876, "spots_left": 10, "image_url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", "meta_text": "4 hours · Half day"},
            {"slug": "terrenkur", "title": "Terrenkur Trail", "description": "Walk the popular Terrenkur Trail for a light city hike and scenic views.", "price": 10000, "capacity": 12, "seats_available": 12, "lat": 43.2367, "lng": 76.9471, "location_name": "Almaty, Medeu district", "duration_hours": 3, "badge": "City tours", "rating": 4.7, "rating_count": 1540, "spots_left": 12, "image_url": "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80", "meta_text": "3 hours · Half day"},
            {"slug": "assy", "title": "Assy Plateau", "description": "Explore the high-altitude Assy Plateau, known for stunning landscapes and open skies.", "price": 28000, "capacity": 4, "seats_available": 4, "lat": 43.5871, "lng": 77.1663, "location_name": "Almaty region", "duration_hours": 10, "badge": "Adventure", "rating": 4.8, "rating_count": 1876, "spots_left": 4, "image_url": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80", "meta_text": "10 hours · Day trip"},
            {"slug": "turgen", "title": "Turgen Waterfalls", "description": "Visit the scenic Turgen Waterfalls and enjoy a full day of nature and fresh air.", "price": 22000, "capacity": 7, "seats_available": 7, "lat": 43.4431, "lng": 77.6209, "location_name": "Almaty region", "duration_hours": 8, "badge": "Nature", "rating": 4.7, "rating_count": 2105, "spots_left": 7, "image_url": "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?w=800&q=80", "meta_text": "8 hours · Day trip"},
            {"slug": "bartogay", "title": "Bartogay Reservoir", "description": "Spend a day at Bartogay Reservoir with beautiful water views and peaceful landscapes.", "price": 20000, "capacity": 9, "seats_available": 9, "lat": 43.8548, "lng": 78.5975, "location_name": "Almaty region", "duration_hours": 9, "badge": "Nature", "rating": 4.6, "rating_count": 934, "spots_left": 9, "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", "meta_text": "9 hours · Day trip"},
            {"slug": "issyk", "title": "Issyk Lake", "description": "Discover Issyk Lake, a beautiful mountain lake surrounded by scenic peaks.", "price": 17000, "capacity": 6, "seats_available": 6, "lat": 43.3598, "lng": 77.4000, "location_name": "Almaty region", "duration_hours": 7, "badge": "Nature", "rating": 4.5, "rating_count": 1688, "spots_left": 6, "image_url": "https://images.unsplash.com/photo-1478827217976-7214a0556393?w=800&q=80", "meta_text": "7 hours · Day trip"},
            {"slug": "panfilov", "title": "Panfilov Park", "description": "Stroll through the historic Panfilov Park in the heart of Almaty city.", "price": 8000, "capacity": 15, "seats_available": 15, "lat": 43.2388, "lng": 76.9476, "location_name": "Almaty City Center", "duration_hours": 3, "badge": "City tours", "rating": 4.6, "rating_count": 2230, "spots_left": 15, "image_url": "/images/panfilov-park.jpg", "meta_text": "3 hours · Half day"},
        ]
        
        for tour in TOURS:
            h3_idx = h3.latlng_to_cell(tour["lat"], tour["lng"], 8)
            h3_reg = h3.latlng_to_cell(tour["lat"], tour["lng"], 5)
            cursor.execute("""
                INSERT INTO tours 
                (slug, title, description, guide_id, price, capacity, seats_available, lat, lng, 
                 h3_index, h3_region, location_name, schedule_date, duration_hours, status,
                 image_url, badge, rating, rating_count, spots_left, meta_text)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                tour["slug"], tour["title"], tour["description"], guide_id, tour["price"],
                tour["capacity"], tour["seats_available"], tour["lat"], tour["lng"],
                h3_idx, h3_reg, tour["location_name"], "2026-03-15", tour["duration_hours"], "active",
                tour["image_url"], tour["badge"], tour["rating"], tour["rating_count"],
                tour["spots_left"], tour["meta_text"]
            ))
        
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

