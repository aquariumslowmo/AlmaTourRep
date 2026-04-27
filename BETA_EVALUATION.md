# Beta System Evaluation and Improvements
*(In response to INF 395 and related structured tasks)*

## Phase 1 / Task 1: System Audit

### System Description
AlmaTour is an online platform for booking local tours (like Charyn Canyon or Shymbulak). Tourists can view and book tours, Guides can create and update them, and Admins can see analytics and audit logs. The system uses a specialized map grid (H3) to group tours by area to quickly look up analytics based on location.

### User Journey (Step-by-step)
1. **Landing/Auth**: User arrives at the index page and clicks login.
2. **Login**: User enters email/password. Server returns a bearer token upon success.
3. **Browse Tours**: User calls `/tours` (possibly with location filters). System returns a list of active tours matching the grid.
4. **Book Tour**: User selects a tour and calls `/bookings`. The backend deducts available seats and triggers an internal event to update regional analytics.
5. (Guide/Admin Workflow): Guide creates a tour (`/tours` POST) and updates their own tours mapping to their region.

### Data Flow
- **Client → API**: HTTP requests carrying JSON payloads and Bearer tokens for endpoints.
- **Middleware**: API intercepts request, logs it, and verifies RBAC tokens in standard headers.
- **Backend → SQLite DB**: Models read/write booking information and update seat availability within a single transaction.
- **Async Event Bus**: Confirmations dispatch to an in-memory queue (`event_queue`).
- **Worker Thread**: Processes booking confirmations from the memory queue and executes SQL increments to the `h3_region_analytics` table.

### Technical Audit
- **Frontend**: Vanilla HTML/CSS/JS served directly via FastAPI endpoints and StaticFiles.
- **Backend**: FastAPI with Python 3.
- **Database**: SQLite3.
- **API Endpoints**: `/tours`, `/bookings`, `/analytics/h3`, `/auth/login`, `/admin/audit-log`.

### 5 Failure Points (Assumptions before testing)
1. Concurrency: High traffic booking the same tour might ignore seat limits (race condition).
2. Data Loss on Crash: In-memory `event_queue` will dump pending analytics updates on server restart.
3. Scaling: SQLite DB will lock frequently under heavy concurrent writes.
4. Validation: No constraint checking if a tour is scheduled in the past or if capacity is negative.
5. Large inputs: Massive payload in `/tours` description could cause memory/DB Bloat.

---

## Phase 2 / Task 2: Failure Testing (Break Your Own System)

| Test | Result | Failure | Severity | Fix Idea |
|------|--------|---------|----------|----------|
| **Rapid requests (Bookings)** | Both requests booked the last seat | Overbooked tour (Seats < 0) | High | Introduce DB Locks/Transactions for seat checking. |
| **Empty input (Login)** | Internal Server Error (500) crash | Unhandled null reference in DB | Med | Add `if not email` validations or Pydantic fields. |
| **Invalid format (Lat/Lng)** | Internal Server Error from H3 | H3 lib threw exception | Med | Catch exceptions when parsing lat/lng to grid cell. |
| **Large description input** | Accepted string of 5MB | DB size increased drastically | Low | Enforce character limits in Pydantic. |

---

## Phase 3 / Phase 4: Fix and Improve Tasks

### Task 3: Logging Implementation
I have implemented logging middleware in `main.py` using Python's `logging` module. It tracks start, success, and failure of all requests with execution times.
**Code snippet added:**
```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    logger.info(f"Request started: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Request success: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(f"Request failed: {request.method} {request.url.path} - Error: {str(e)} - Time: {process_time:.4f}s")
        raise e
```
*Output sample:* `2026-04-27 10:14:02 - AlmaTour - INFO - Request success: GET /tours - Status: 200 - Time: 0.0034s`

### Task 4 & 5: Performance & Bottlenecks

| Case | Time | Observation |
|------|------|-------------|
| Normal `/tours` | 0.003s | Extremely fast due to index and local DB. |
| Heavy spatial query | 0.015s | Minor degradation as H3 loop and dynamically constructed IN clause gets executed. |

**Bottleneck Identification:**
- **Slowest Part**: H3 computations for spatial indices on writes.
- **Fragile Part**: The single-threaded `event_worker()` queue for analytics. If it encounters a bug, it dies silently.
- **Complex Part**: RBAC + Pydantic validation crossing over raw SQLite queries causes disjointed constraints.

### Task 6: Tech Debt Fix
*Issues identified:*
1. Hardcoded DB string `almatour.db`.
2. Repetition of DB connecting/closing.
3. Lack of proper ORM makes relations fragile.
*Fix implemented:* We fixed repetition of the frontend file delivery by introducing a generic `/{filename}` handler instead of hardcoding 20 endpoint strings.

### Task 7: Input Validation
Added checks for **Empty input** in `/auth/login`:
```python
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password cannot be empty")
```

### Task 8: Failure Recovery Design
- **API Fails**: Currently drops connection. Improved: Fastapi's Exception hooks return standardized Error JSON.
- **Database Fails**: Currently returns 500. Improved: Add connection retry mechanics (`retry=3` pool).
- **Server Crash**: Memory queue events drop. Improved: Need an external broker (Redis/RabbitMQ) for the events instead of `queue.Queue`.

### Task 9: Feature Expansion
**Added Feature: Search for Tours.**
Modified `/tours` to include a `search_text` parameter.
*Explanation:* Users often don't want to use exact map coordinates, they want to type "Canyon" or "Ice Rink". I added a `%LIKE%` SQL query block to `list_tours()` to match against the title or description.

### Task 11: Data Handling (Null values)
Before: A missing field in TourCreate would throw a raw unhandled error if SQLite threw constraint failures.
After: Null values are handled by Pydantic models automatically.

### Task 12: System Explanation

*What it does:*
AlmaTour provides a platform connecting tourists and local tour guides. Tourists use it to view available destinations, filter them by geographic area, and reserve seats on trips. Guides use the platform to publish their tour schedules and manage capacity. Administrators use it to track platform activity, ensuring smooth operations by monitoring analytical data on which regions are booking the most tours and generating the most revenue.

*How it works:*
The backend is built with FastAPI. It handles routing and validates incoming data via Pydantic. It stores information in a local SQLite database. When tours are created, latitude and longitude map coordinates are transformed into hexagon "cells" using Uber's H3 spatial indexing system. This allows rapid geographic filtering without complex coordinate math. Authentication uses a bearer token stored in a sessions table. When a tourist books a tour, the API deducts a seat synchronously, but publishes a message into an asynchronous background queue. A separate background thread picks up this message to update regional revenue statistics, ensuring the user isn't forced to wait for heavy analytical database queries to complete.
