# Job Trends Feature Documentation

Author: GrowthMap Engineering
Last Updated: 2026-03-18
Status: Implemented (MVP)

## 1. Executive Summary

The Job Trends feature provides a public, near-real-time view of role demand trends in the ICT job market.

It includes:

- Monthly demand trend visualization for a selected role.
- Live summary metrics (latest demand, growth, average, peak, role coverage).
- A cross-role ranking snapshot for latest demand values.
- Simulated real-time updates delivered over Socket.IO and persisted to MongoDB.
- Synthetic monthly dataset generation and seeding for stable local/demo usage.

The implementation is optimized for MVP delivery while preserving clear extension points for richer analytics.

## 2. Product Scope

### 2.1 In Scope

- Public Job Trends page route.
- Role filter driven by backend distinct role list.
- Monthly trend chart for one selected role at a time.
- Live stat cards powered by backend calculations.
- Realtime updates via socket events.
- MongoDB persistence of simulated updates.
- Seed script to generate 24 months of synthetic data.

### 2.2 Out of Scope (MVP)

- External labor market API integrations.
- Role comparison multi-series chart in the main trend panel.
- Drill-down role details page.
- Authentication-gated access.

## 3. User Experience

### 3.1 Access Points

- Top navigation: Job Trends
- Home page CTA button: Job Trends
- Direct route: /job-trends

### 3.2 Core User Flow

1. User opens Job Trends page.
2. Frontend loads role options from backend.
3. First role is auto-selected.
4. Frontend loads:
   - trend points for selected role
   - stats for selected role
   - latest demand snapshot for all roles
5. Socket connection becomes active.
6. Simulated updates are emitted by backend and applied live on page.

## 4. Architecture

The feature is implemented as a full-stack path within the existing Node + React runtime.

```mermaid
flowchart LR
  A[Frontend Job Trends Page] -->|GET roles| B[/api/job-trends/roles]
  A -->|GET trends| C[/api/job-trends]
  A -->|GET stats| D[/api/job-trends/stats]
  E[Socket.IO Client] <-->|job-trends:update| F[Socket.IO Server]
  B --> G[(MongoDB jobtrends collection)]
  C --> G
  D --> G
  F --> G
  H[Seed Script] --> G
```

## 5. Backend Design

### 5.1 Data Model

File: backend/models/JobTrend.js

Schema fields:

- title: String, required, indexed, trimmed
- demand: Number, required, min 0
- date: Date, required, indexed

Indexes:

- Unique composite index on title + date
- Partial filter expression on date type to avoid legacy bad docs interfering with uniqueness

### 5.2 API Endpoints

File: backend/routes/jobTrendRoutes.js

#### GET /api/job-trends/roles

Returns distinct role names sorted alphabetically.

Response example:

```json
[
  "AI Engineer",
  "Cloud Engineer",
  "Cyber Security Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Web Developer"
]
```

#### GET /api/job-trends

Query params:

- role: optional string
- months: optional integer, default 24, max 60

Behavior:

- If role is provided, returns monthly points for that role.
- If role is omitted, returns monthly aggregate points under title All Roles, based on average demand across roles per month.
- Always returns latestRoleDemands snapshot for ranking panel.

Response shape:

```json
{
  "role": "AI Engineer",
  "points": [
    {
      "id": "...",
      "title": "AI Engineer",
      "demand": 114,
      "date": "2026-03-01T00:00:00.000Z",
      "monthLabel": "Mar 2026"
    }
  ],
  "latestRoleDemands": [
    {
      "title": "AI Engineer",
      "demand": 114,
      "date": "2026-03-01T00:00:00.000Z",
      "monthLabel": "Mar 2026"
    }
  ]
}
```

#### GET /api/job-trends/stats

Query params:

- role: optional string
- months: optional integer, default 24, max 60

Returns computed metrics from filtered points:

- latestDemand
- previousDemand
- growthPct
- averageDemand
- peakDemand
- lowDemand
- monthsTracked
- activeRoles

Response shape:

```json
{
  "role": "AI Engineer",
  "latestDemand": 114,
  "previousDemand": 113,
  "growthPct": 0.88,
  "averageDemand": 98.38,
  "peakDemand": 114,
  "lowDemand": 76,
  "monthsTracked": 24,
  "activeRoles": 7
}
```

### 5.3 Realtime Update Engine

File: backend/server.js

Server behavior:

- Express app is wrapped by a native HTTP server.
- Socket.IO is attached to the same server/port.
- Job trends route is mounted at /api/job-trends.

Socket configuration:

- origin from FRONTEND_ORIGIN env var (fallback *)

Events:

- job-trends:connected (server to client)
- job-trends:update (server to client)

Update cycle:

1. Distinct roles are queried.
2. One random role is selected.
3. Latest monthly point for that role is read.
4. Demand is shifted by a random delta between -3 and +5.
5. Demand is clamped to [10, 300].
6. Updated point is persisted to MongoDB.
7. Event payload is emitted with:
   - updated point
   - refreshed latestRoleDemands snapshot
   - updatedAt timestamp

Interval:

- Controlled by JOB_TRENDS_SIM_INTERVAL_MS
- Default 15000 ms

### 5.4 Seed and Data Generation

File: backend/seed.js

Strategy:

- Generate synthetic monthly data across 7 role profiles.
- Use rolling 24-month window ending in current month.
- Demand is generated using:
  - base value
  - linear upward trend
  - seasonal sinusoidal wave
  - random noise
- Demand is clamped to [20, 220].

Seed behavior:

- Deletes existing job trend records.
- Inserts generated records.
- Current total: 168 records (7 roles x 24 months).

## 6. Frontend Design

### 6.1 Routing and Navigation

Files:

- frontend/src/App.tsx
- frontend/src/Layout.jsx
- frontend/src/pages/Dashboard/Home.jsx

Changes:

- Route added: /job-trends
- Top nav link added: Job Trends
- Home page CTA button added: Job Trends

### 6.2 Page Behavior

File: frontend/src/pages/Dashboard/JobTrends.jsx

Data source:

- API base from VITE_API_BASE_URL
- Fallback: http://localhost:5000

State:

- roles
- selectedRole
- trendPoints
- latestRoleDemands
- stats
- loading and refreshing states
- error state
- liveConnected socket state

Load flow:

1. Fetch role list.
2. Select first role.
3. Fetch trend points and stats in parallel.
4. Render charts and stat cards.

Realtime flow:

- Connect to socket server.
- Listen for job-trends:update.
- Update role snapshot list.
- If updated role matches selected role, merge the point and recompute local stats immediately for smooth UI.

### 6.3 Visual Sections

- Header with live connection indicator and refresh action.
- Role selector with rolling window label.
- 4 summary metric cards.
- Left chart: monthly demand area chart for selected role.
- Right chart: latest demand by role bar chart.
- Empty-state and error-state handling.

## 7. Configuration

### 7.1 Backend

- MONGO_URI
- PORT (default 5000)
- FRONTEND_ORIGIN (recommended for socket CORS)
- JOB_TRENDS_SIM_INTERVAL_MS (default 15000)

### 7.2 Frontend

- VITE_API_BASE_URL (optional, defaults to http://localhost:5000)

## 8. Runbook

### 8.1 Seed Data

From repository root:

- cd backend
- node seed.js

Expected output:

- Connected to MongoDB for monthly job trends seeding...
- Job trend data seeded successfully: 168 records across 7 roles.

### 8.2 Start Backend

- cd backend
- npm run dev

Expected:

- Server running on port 5000
- Job trends simulation active log line

### 8.3 Start Frontend

- cd frontend
- npm run dev

Open:

- http://localhost:5173/job-trends

## 9. Validation Checklist

### 9.1 API checks

- GET /api/job-trends/roles returns role array.
- GET /api/job-trends?role=AI Engineer&months=3 returns points + latestRoleDemands.
- GET /api/job-trends/stats?role=AI Engineer&months=24 returns computed metrics.

### 9.2 Realtime checks

- Client receives job-trends:update events approximately every configured interval.
- Selected role chart updates without page reload.
- Role ranking bars update from latest snapshots.

### 9.3 UI checks

- Role dropdown changes both chart and stats.
- Refresh button manually reloads API state.
- Connection badge changes if socket disconnects.

## 10. Operational Notes and Troubleshooting

### 10.1 Common startup issues

- Missing script dev: run npm commands in backend or frontend folder, not project root.
- Port in use: free port 5000 or 5173 before restart.
- macOS operation not permitted on node_modules scripts: remove quarantine attributes.

### 10.2 Empty role list

Cause:

- No seeded records in MongoDB.

Fix:

- Run backend/seed.js again.

### 10.3 Socket not connecting

Check:

- Backend server is running.
- FRONTEND_ORIGIN allows your frontend host.
- Network/proxy is not blocking websocket transport.

## 11. Performance and Scalability

Current optimizations:

- Query window cap of 60 months.
- Indexed fields for title/date queries.
- Distinct role and grouped aggregate logic kept small for MVP-scale data.

Future improvements:

- Caching layer for stats endpoint.
- Batch simulation writes under heavier load.
- Aggregation precompute for large historical datasets.

## 12. Security and Governance

Current posture:

- Public endpoint access by design for MVP.
- Broad CORS compatibility currently enabled.

Recommendations for production:

- Restrict CORS to known frontend origins.
- Add API rate limiting.
- Add auth/role gates if trend analytics become private.
- Add audit logs for data simulation mode.

## 13. Known Limitations

- Realtime simulation updates the latest monthly point, not a new month row.
- Data is synthetic, not external market-sourced.
- No details drill-down page in current release.
- Dashboard card in legacy dashboard page is not the primary entry path; top nav and home CTA are the active paths.

## 14. File Inventory for this Feature

Backend:

- backend/models/JobTrend.js
- backend/routes/jobTrendRoutes.js
- backend/server.js
- backend/seed.js

Frontend:

- frontend/src/pages/Dashboard/JobTrends.jsx
- frontend/src/App.tsx
- frontend/src/Layout.jsx
- frontend/src/pages/Dashboard/Home.jsx
- frontend/tsconfig.json

## 15. Next Iteration Suggestions

1. Add month range selector (6, 12, 24, 36).
2. Add role comparison mode (2-3 role multi-series chart).
3. Add CSV export for trend points and stats.
4. Add anomaly badges for large monthly jumps.
5. Add production data connector with adapter layer and fallback strategy.
