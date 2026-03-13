# Royal Canvas — Exam Platform (Frontend)

Frontend-only UI foundation for a web-based exam platform with live monitoring dashboards, alert views, session/device control, analytics, and exam interaction flows. This is a **design-first phase**: no backend, database, or real authentication.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **teacher@example.com** or **student@example.com** (any password) to sign in with mock auth.

## Commands

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |

## Folder structure

```
src/
├── app/              # App-level config (if needed)
├── assets/           # Static assets
├── components/
│   ├── ui/            # Reusable UI (EmptyState, LoadingState, StatCard, AlertBadge, SearchFilterBar)
│   ├── layout/        # AppShell, Sidebar, Topbar
│   ├── dashboard/     # ChartCard
│   ├── monitoring/    # AlertFeed, StudentStatusTable, StudentStatusCard, MonitoringStatusBadge
│   ├── alerts/        # IncidentTimeline
│   ├── sessions/      # DeviceTable, SessionDrawer, EvidencePreviewCard
│   ├── exams/         # QuestionRenderer, QuestionNavigator, ExamTimer, ProgressHeader, ConnectionStatus, WarningBanner
│   └── permissions/   # PermissionStatusBanner, PermissionRequestModal
├── pages/             # Route-level pages (see below)
├── routes/            # React Router config and protected routes
├── hooks/             # useMockSocketEvents
├── contexts/          # AuthContext
├── services/          # socketService (mock), authService (mock)
├── mocks/             # (optional) additional mocks
├── data/              # Mock data (users, exams, questions, students, sessions, devices, alerts, evidence, chart data)
├── utils/             # Helpers
├── constants/         # routes, roles, alerts, questionTypes
└── styles/            # (optional) extra CSS
```

## UI sections implemented

- **Public / Auth:** Login, Register, Forgot password (mock).
- **Teacher:** Dashboard (stats, charts, alert feed, student quick view), Live monitoring (table/grid, session drawer), Alerts timeline (filters, incident timeline), Session management (sessions table), Student session detail (devices, evidence placeholders, alerts).
- **Student:** Exam access (list of exams), Exam session (timer, progress, question types, permission modal, connection status, submit flow), Results (placeholder).
- **Placeholders:** Exam builder, Settings, Admin.
- **Utility:** 404 page.

## Mocked vs future real features

| Area | Current (mocked) | Future / backend |
|------|------------------|-------------------|
| Auth | In-memory login by email; role from mock users | Real API, JWT/sessions |
| Data | Static JSON in `src/data/` | REST/GraphQL, database |
| Real-time | Mock socket service; simulated alert events | Real Socket.IO server |
| Monitoring | UI-only badges and placeholders | Real tab/focus/fullscreen and server-side rules |
| Evidence/recording | Placeholder cards, no media | Real capture, storage, retention jobs |
| Device/session control | Buttons only, no effect | Backend session invalidation, device management |
| Permissions | Modal and banners only | Real browser permissions + backend consent |

## Browser limitations (UX honesty)

The UI does **not** implement:

- Real screen or camera recording
- Real device fingerprinting or MDM-like control
- Real OS-level locking or managed-device enforcement
- Real evidence storage or automatic deletion

Where relevant, labels use “placeholder”, “simulated”, or “mock” so the prototype does not overstate capabilities.

## Backend integration points

- **Auth:** Replace `authService` with API calls; keep `AuthContext` and role-based routes.
- **Data:** Replace `src/data/*` with API calls or a data layer; keep same shapes for components.
- **Sockets:** Swap mock `socketService` for `io(url)` and same event names (`alert`, `session_update`, etc.).
- **Evidence:** Backend endpoints for upload, playback URL, and retention status; keep `EvidencePreviewCard` and link to real IDs.

## Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | UI |
| vite | Build and dev server |
| react-router-dom | Routing and protected routes |
| tailwindcss, postcss, autoprefixer | Styling |
| chart.js, react-chartjs-2 | Dashboard and analytics charts |
| socket.io-client | Client API for real-time (wired to mock in this phase) |

---

**Royal Canvas** — Academic exam supervision and delivery UI prototype.
