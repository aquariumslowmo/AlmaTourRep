"""
AlmaTour - Institutional Information System
INF 395 Assignment - Phase 2
FastAPI backend with H3 spatial indexing, RBAC, audit logging, and event-driven components
"""

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List
import sqlite3
import json
import queue
import threading
import h3
import hashlib
import secrets
import os
from contextlib import asynccontextmanager

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("AlmaTour IS started. Database initialized.")
    yield

app = FastAPI(title="AlmaTour Information System", version="1.0.0", lifespan=lifespan)
security = HTTPBearer()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

# Mount images from the assets folder directly
app.mount("/images", StaticFiles(directory=os.path.join(PROJECT_ROOT, "assets")), name="images")

# In-memory event queue (simulates message broker)
event_queue: queue.Queue = queue.Queue()

# ─────────────────────────────────────────────
# Database Setup
# ─────────────────────────────────────────────
DB_PATH = "almatour.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Users table
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('tourist', 'guide', 'admin')),
        name TEXT NOT NULL,
        region_h3 TEXT,          -- H3 index of user's home region
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Tours table (with H3 spatial indexing)
    c.execute("""
    CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        guide_id INTEGER REFERENCES users(id),
        price REAL NOT NULL,
        capacity INTEGER NOT NULL,
        seats_available INTEGER NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        h3_index TEXT NOT NULL,          -- H3 cell at resolution 8
        h3_region TEXT NOT NULL,         -- H3 cell at resolution 5 (zone-level)
        location_name TEXT NOT NULL,
        schedule_date TEXT NOT NULL,
        duration_hours REAL,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'cancelled', 'completed')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Bookings table
    c.execute("""
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tour_id INTEGER REFERENCES tours(id),
        tourist_id INTEGER REFERENCES users(id),
        seats_booked INTEGER NOT NULL DEFAULT 1,
        status TEXT DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled')),
        total_price REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Audit log table
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_email TEXT,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entity_id INTEGER,
        details TEXT,
        ip_address TEXT DEFAULT '127.0.0.1',
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Analytics aggregation table (H3 region stats)
    c.execute("""
    CREATE TABLE IF NOT EXISTS h3_region_analytics (
        h3_region TEXT PRIMARY KEY,
        resolution INTEGER DEFAULT 5,
        total_tours INTEGER DEFAULT 0,
        total_bookings INTEGER DEFAULT 0,
        total_revenue REAL DEFAULT 0.0,
        avg_rating REAL DEFAULT 0.0,
        last_updated TEXT DEFAULT CURRENT_TIMESTAMP
    )""")

    # Sessions (simple token store)
    c.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        role TEXT NOT NULL,
        expires_at TEXT
    )""")

    # Seed admin user
    admin_hash = hashlib.sha256("admin123".encode()).hexdigest()
    c.execute("INSERT OR IGNORE INTO users (email, password_hash, role, name) VALUES (?,?,?,?)",
              ("admin@almatour.kz", admin_hash, "admin", "System Admin"))

    # Seed guide
    guide_hash = hashlib.sha256("guide123".encode()).hexdigest()
    c.execute("INSERT OR IGNORE INTO users (email, password_hash, role, name, region_h3) VALUES (?,?,?,?,?)",
              ("guide@almatour.kz", guide_hash, "guide", "Aidana Bekova",
               h3.latlng_to_cell(43.2551, 76.9126, 5)))

    # Seed tourist
    tourist_hash = hashlib.sha256("tourist123".encode()).hexdigest()
    c.execute("INSERT OR IGNORE INTO users (email, password_hash, role, name, region_h3) VALUES (?,?,?,?,?)",
              ("tourist@almatour.kz", tourist_hash, "tourist", "James Smith",
               h3.latlng_to_cell(43.2220, 76.8512, 5)))

    # Seed tours with real Almaty coordinates
    TOURS = [
        ("Shymbulak Mountain Tour", "Cable car ride & ski resort visit", 2, 45.0, 10, 10,
         43.1393, 77.0785, "Shymbulak, Almaty"),
        ("Medeu Ice Rink Experience", "World's highest skating rink outdoor visit", 2, 25.0, 20, 20,
         43.1560, 77.0572, "Medeu, Almaty"),
        ("Kok-Tobe Cable Car & View", "Panoramic city views from Kok-Tobe Hill", 2, 30.0, 15, 15,
         43.2335, 76.9720, "Kok-Tobe, Almaty"),
        ("Almaty Green Bazaar Food Tour", "Taste local cuisine at the historic bazaar", 2, 20.0, 12, 12,
         43.2551, 76.9440, "Green Bazaar, Almaty"),
        ("Charyn Canyon Day Trip", "Spectacular canyon 200km from Almaty", 2, 80.0, 8, 8,
         43.3503, 79.0700, "Charyn Canyon"),
    ]
    for t in TOURS:
        title, desc, guide_id, price, cap, seats, lat, lng, loc = t
        h3_idx = h3.latlng_to_cell(lat, lng, 8)
        h3_reg = h3.latlng_to_cell(lat, lng, 5)
        c.execute("""INSERT OR IGNORE INTO tours
            (title, description, guide_id, price, capacity, seats_available, lat, lng,
             h3_index, h3_region, location_name, schedule_date)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            (title, desc, guide_id, price, cap, seats, lat, lng,
             h3_idx, h3_reg, loc, "2026-03-15"))

    conn.commit()
    conn.close()

# ─────────────────────────────────────────────
# Auth & RBAC
# ─────────────────────────────────────────────
ROLE_PERMISSIONS = {
    "tourist": ["read:tours", "create:booking", "read:booking_own", "cancel:booking_own"],
    "guide":   ["read:tours", "create:tour", "update:tour_own", "read:booking_own_tour",
                "read:analytics_own"],
    "admin":   ["read:tours", "create:tour", "update:tour", "delete:tour",
                "create:booking", "read:booking", "cancel:booking",
                "read:analytics", "manage:users", "read:audit_log"],
}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    row = conn.execute("SELECT * FROM sessions WHERE token=?", (token,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"user_id": row["user_id"], "role": row["role"]}

def require_permission(permission: str):
    def checker(user=Depends(get_current_user)):
        if permission not in ROLE_PERMISSIONS.get(user["role"], []):
            raise HTTPException(status_code=403,
                detail=f"Role '{user['role']}' lacks permission: {permission}")
        return user
    return checker

# ABAC rule: Guides can only update their own tours
def abac_guide_owns_tour(tour_id: int, user: dict, db: sqlite3.Connection) -> bool:
    if user["role"] == "admin":
        return True
    tour = db.execute("SELECT guide_id FROM tours WHERE id=?", (tour_id,)).fetchone()
    return tour and tour["guide_id"] == user["user_id"]

# ─────────────────────────────────────────────
# Audit Logging
# ─────────────────────────────────────────────
def audit(db, user_id, user_email, action, entity, entity_id=None, details=None):
    db.execute("""INSERT INTO audit_log (user_id, user_email, action, entity, entity_id, details)
                  VALUES (?,?,?,?,?,?)""",
               (user_id, user_email, action, entity, entity_id,
                json.dumps(details) if details else None))
    db.commit()

# ─────────────────────────────────────────────
# Event-Driven: Background processor
# ─────────────────────────────────────────────
def event_worker():
    """Background thread that processes booking events and updates H3 analytics."""
    while True:
        try:
            event = event_queue.get(timeout=1)
            if event["type"] == "booking_confirmed":
                conn = sqlite3.connect(DB_PATH)
                tour = conn.execute("SELECT h3_region, price FROM tours WHERE id=?",
                                    (event["tour_id"],)).fetchone()
                if tour:
                    conn.execute("""
                        INSERT INTO h3_region_analytics (h3_region, total_tours, total_bookings, total_revenue)
                        VALUES (?, 1, 1, ?)
                        ON CONFLICT(h3_region) DO UPDATE SET
                            total_bookings = total_bookings + 1,
                            total_revenue = total_revenue + ?,
                            last_updated = CURRENT_TIMESTAMP
                    """, (tour["h3_region"], event["price"], event["price"]))
                    conn.commit()
                conn.close()
                print(f"[EVENT] Processed booking_confirmed → H3 analytics updated for region {tour['h3_region'] if tour else 'N/A'}")
            event_queue.task_done()
        except queue.Empty:
            pass

# Start background worker
threading.Thread(target=event_worker, daemon=True).start()

# ─────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str

class TourCreate(BaseModel):
    title: str
    description: str
    price: float
    capacity: int
    lat: float
    lng: float
    location_name: str
    schedule_date: str
    duration_hours: Optional[float] = 2.0

class BookingCreate(BaseModel):
    tour_id: int
    seats: int = 1

class TourUpdate(BaseModel):
    price: Optional[float] = None
    seats_available: Optional[int] = None
    status: Optional[str] = None

# ─────────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/", include_in_schema=False)
def root():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/style.css", include_in_schema=False)
def get_css():
    return FileResponse(os.path.join(BASE_DIR, "style.css"))

@app.get("/script.js", include_in_schema=False)
def get_js():
    return FileResponse(os.path.join(BASE_DIR, "script.js"))


@app.post("/auth/login", tags=["Auth"])
def login(req: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    """Authenticate and receive a Bearer token."""
    user = db.execute("SELECT * FROM users WHERE email=? AND password_hash=?",
                      (req.email, hash_password(req.password))).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = secrets.token_hex(32)
    db.execute("INSERT INTO sessions (token, user_id, role) VALUES (?,?,?)",
               (token, user["id"], user["role"]))
    db.commit()
    audit(db, user["id"], user["email"], "LOGIN", "session", details={"role": user["role"]})
    return {"token": token, "role": user["role"], "name": user["name"]}


# ─── ENDPOINT 1: List Tours (with optional H3 filter) ───
@app.get("/tours", tags=["Tours"])
def list_tours(
    h3_region: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: Optional[float] = 10,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("read:tours"))
):
    """
    List all tours. Supports H3 spatial filtering:
    - h3_region: filter by exact H3 region cell (res 5)
    - lat+lng+radius_km: find tours within H3 ring around a point
    """
    if lat and lng:
        # H3 ring-based spatial query
        center_cell = h3.latlng_to_cell(lat, lng, 8)
        k_rings = max(1, int(radius_km / 1.5))  # ~1.5km per ring at res 8
        nearby_cells = h3.grid_disk(center_cell, k_rings)
        placeholders = ",".join("?" * len(nearby_cells))
        rows = db.execute(
            f"SELECT * FROM tours WHERE h3_index IN ({placeholders}) AND status='active'",
            list(nearby_cells)
        ).fetchall()
        return {"source": "h3_spatial_query", "center_cell": center_cell,
                "rings": k_rings, "tours": [dict(r) for r in rows]}

    if h3_region:
        rows = db.execute(
            "SELECT * FROM tours WHERE h3_region=? AND status='active'", (h3_region,)
        ).fetchall()
        return {"source": "h3_region_filter", "h3_region": h3_region,
                "tours": [dict(r) for r in rows]}

    rows = db.execute("SELECT * FROM tours WHERE status='active'").fetchall()
    return {"tours": [dict(r) for r in rows]}


# ─── ENDPOINT 2: Create Tour (Guide/Admin) ───
@app.post("/tours", tags=["Tours"], status_code=201)
def create_tour(
    body: TourCreate,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("create:tour"))
):
    """Create a new tour. H3 index is auto-computed from lat/lng."""
    h3_idx = h3.latlng_to_cell(body.lat, body.lng, 8)
    h3_reg = h3.latlng_to_cell(body.lat, body.lng, 5)
    cur = db.execute("""
        INSERT INTO tours (title, description, guide_id, price, capacity, seats_available,
                           lat, lng, h3_index, h3_region, location_name, schedule_date, duration_hours)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, (body.title, body.description, user["user_id"], body.price,
          body.capacity, body.capacity, body.lat, body.lng,
          h3_idx, h3_reg, body.location_name, body.schedule_date, body.duration_hours))
    db.commit()
    audit(db, user["user_id"], None, "CREATE_TOUR", "tour", cur.lastrowid,
          {"title": body.title, "h3_index": h3_idx, "h3_region": h3_reg})
    return {"id": cur.lastrowid, "h3_index": h3_idx, "h3_region": h3_reg}


# ─── ENDPOINT 3: Book a Tour (Tourist) ───
@app.post("/bookings", tags=["Bookings"], status_code=201)
def create_booking(
    body: BookingCreate,
    background_tasks: BackgroundTasks,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("create:booking"))
):
    """Book seats on a tour. Triggers async H3 analytics update."""
    tour = db.execute("SELECT * FROM tours WHERE id=? AND status='active'",
                      (body.tour_id,)).fetchone()
    if not tour:
        raise HTTPException(404, "Tour not found or not active")
    if tour["seats_available"] < body.seats:
        raise HTTPException(400, f"Only {tour['seats_available']} seats available")

    total = tour["price"] * body.seats
    cur = db.execute("""
        INSERT INTO bookings (tour_id, tourist_id, seats_booked, total_price)
        VALUES (?,?,?,?)
    """, (body.tour_id, user["user_id"], body.seats, total))
    db.execute("UPDATE tours SET seats_available = seats_available - ? WHERE id=?",
               (body.seats, body.tour_id))
    db.commit()

    # Publish event to queue (event-driven component)
    event_queue.put({
        "type": "booking_confirmed",
        "tour_id": body.tour_id,
        "booking_id": cur.lastrowid,
        "price": total,
        "h3_region": tour["h3_region"]
    })

    audit(db, user["user_id"], None, "CREATE_BOOKING", "booking", cur.lastrowid,
          {"tour_id": body.tour_id, "seats": body.seats, "total": total})
    return {"booking_id": cur.lastrowid, "total_price": total, "status": "confirmed"}


# ─── ENDPOINT 4: H3 Analytics by Region ───
@app.get("/analytics/h3", tags=["Analytics"])
def h3_analytics(
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("read:analytics"))
):
    """Admin: aggregated booking revenue and count per H3 region."""
    rows = db.execute("SELECT * FROM h3_region_analytics ORDER BY total_revenue DESC").fetchall()
    enriched = []
    for r in rows:
        d = dict(r)
        try:
            center = h3.cell_to_latlng(r["h3_region"])
            d["center_lat"] = center[0]
            d["center_lng"] = center[1]
        except Exception:
            pass
        enriched.append(d)
    return {"h3_region_stats": enriched}


# ─── ENDPOINT 5: Audit Log (Admin only) ───
@app.get("/admin/audit-log", tags=["Admin"])
def get_audit_log(
    limit: int = 50,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("read:audit_log"))
):
    """Admin only: retrieve system audit log."""
    rows = db.execute(
        "SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?", (limit,)
    ).fetchall()
    return {"audit_log": [dict(r) for r in rows]}


# ─── ENDPOINT 6: Update Tour (ABAC enforced) ───
@app.patch("/tours/{tour_id}", tags=["Tours"])
def update_tour(
    tour_id: int,
    body: TourUpdate,
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("create:tour"))
):
    """Update tour. ABAC: guides can only update their own tours."""
    if not abac_guide_owns_tour(tour_id, user, db):
        raise HTTPException(403, "You can only update your own tours (ABAC rule)")

    updates, vals = [], []
    if body.price is not None:
        updates.append("price=?"); vals.append(body.price)
    if body.seats_available is not None:
        updates.append("seats_available=?"); vals.append(body.seats_available)
    if body.status is not None:
        updates.append("status=?"); vals.append(body.status)
    if not updates:
        raise HTTPException(400, "Nothing to update")

    vals.append(tour_id)
    db.execute(f"UPDATE tours SET {','.join(updates)} WHERE id=?", vals)
    db.commit()
    audit(db, user["user_id"], None, "UPDATE_TOUR", "tour", tour_id, dict(body))
    return {"updated": True}


# ─── ENDPOINT 7: My Bookings ───
@app.get("/bookings/me", tags=["Bookings"])
def my_bookings(
    db: sqlite3.Connection = Depends(get_db),
    user=Depends(require_permission("read:booking_own"))
):
    """Get the current user's bookings."""
    rows = db.execute("""
        SELECT b.*, t.title, t.location_name, t.h3_index, t.schedule_date
        FROM bookings b JOIN tours t ON b.tour_id = t.id
        WHERE b.tourist_id = ?
    """, (user["user_id"],)).fetchall()
    return {"bookings": [dict(r) for r in rows]}


# ─────────────────────────────────────────────
# Startup
# ─────────────────────────────────────────────
# (Removed deprecated on_event)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
