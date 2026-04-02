# AlmaTour — Institutional Information System
**INF 395 Assignment – Phase 2**

## Team Members & Roles
| Name | Email | Role |
|------|-------|------|
| Aibek Ayazgaliev | 230103341@sdu.edu.kz | Backend Developer |
| Kuandyk Shapagat | 230103119@sdu.edu.kz | Frontend Developer |
| Aknur Rufatkyzy | 2301033241@sdu.edu.kz | UI/UX Designer |
| Akerke Yessenkos | 230103227@sdu.edu.kz | UX Research & Prototyping |

---

## How to Run the System

### Prerequisites
```bash
pip install fastapi uvicorn h3 pydantic
```

### Start the server
```bash
cd almatour
python main.py
# or
uvicorn main:app --reload --port 8000
```

### Interactive API docs
Open: http://localhost:8000/docs

---

## Quick Demo Walkthrough

### 1. Login as Admin
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@almatour.kz","password":"admin123"}'
# → {"token": "<ADMIN_TOKEN>", "role": "admin", ...}
```

### 2. Login as Tourist
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tourist@almatour.kz","password":"tourist123"}'
# → {"token": "<TOURIST_TOKEN>", ...}
```

### 3. List Tours (spatial H3 query around Almaty center)
```bash
curl "http://localhost:8000/tours?lat=43.255&lng=76.945&radius_km=5" \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Book a Tour
```bash
curl -X POST http://localhost:8000/bookings \
  -H "Authorization: Bearer <TOURIST_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"tour_id": 1, "seats": 2}'
```

### 5. View Audit Log (Admin only)
```bash
curl http://localhost:8000/admin/audit-log \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 6. H3 Regional Analytics (Admin only)
```bash
curl http://localhost:8000/analytics/h3 \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### 7. RBAC Test — Tourist tries to access audit log (should fail with 403)
```bash
curl http://localhost:8000/admin/audit-log \
  -H "Authorization: Bearer <TOURIST_TOKEN>"
# → {"detail": "Role 'tourist' lacks permission: read:audit_log"}
```

---

## How H3 is Used in the System

H3 (Uber's hexagonal hierarchical geospatial indexing library) is integrated in three ways:

### 1. Tour Spatial Indexing (Resolution 8 — ~0.5km cells)
- Every tour is stored with an `h3_index` column (res 8) computed from its GPS coordinates
- **Query**: When tourists search with `lat/lng/radius_km`, the system converts to H3 cells using `h3.grid_disk()` and queries tours by H3 index — no expensive geo-distance math needed

### 2. Regional Zoning (Resolution 5 — ~250km² regions)
- Tours also store an `h3_region` (res 5) for broad zone grouping
- Guides and operators can filter or analyze tours by zone (e.g., all mountain tours vs city tours)

### 3. Analytics Aggregation
- The `h3_region_analytics` table aggregates bookings, revenue, and tour counts **per H3 hex region**
- Updated asynchronously via event queue whenever a booking is confirmed
- Each analytics record enriches with `center_lat/center_lng` decoded from H3 for map visualization

### Why H3 is Appropriate for AlmaTour
| Reason | Details |
|--------|---------|
| Consistent cell sizes | H3 cells at the same resolution are nearly equal area — fair zoning |
| Fast spatial queries | Polygon containment replaced by simple string equality on h3_index |
| Scalable hierarchies | Resolution 5 (zone) → 8 (tour location) supports drill-down analytics |
| Tourism zones | City districts, mountain regions, canyon areas map naturally to H3 polygons |

---

## Architecture
- **Monolith FastAPI** with modular structure
- **SQLite** database (swap for PostgreSQL in production)
- **Event queue** (`queue.Queue` + background thread) simulates message broker
- **RBAC** enforced at every endpoint via `Depends(require_permission(...))`
- **ABAC rule**: Guides can only modify their own tours (checked via `abac_guide_owns_tour()`)
- **Audit logging**: All critical actions (login, create_tour, create_booking, update_tour) logged

## Default Credentials (Seeded)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@almatour.kz | admin123 |
| Guide | guide@almatour.kz | guide123 |
| Tourist | tourist@almatour.kz | tourist123 |
