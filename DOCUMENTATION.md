# Construction Mart SHK — Project Documentation

## Overview

Construction Mart SHK is a web-based marketplace that connects the construction ecosystem: Clients/Developers posting projects, Vendors/Contractors bidding on them, Material Suppliers, PMCs, Labours, Engineers/Job Seekers, Freelancers, and Real Estate Brokers. It is built as a React 19 + TypeScript single-page application bundled with Vite, and deploys as a static site on Netlify.

The app works in two modes:

- **Interactive demo mode** — mock data, simulated vendor bids, and local-first persistence (localStorage) so every feature can be explored without a real backend.
- **Backed mode** — optional Supabase persistence (bookings, registrations, contacts, service requests) and Gemini AI assistance, activated when real credentials are placed in `.env`.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 (function components + hooks) |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS (CDN) + inline styles |
| Icons | lucide-react |
| Charts | Recharts |
| Maps | @vis.gl/react-google-maps |
| AI | @google/genai (Gemini 2.5 Flash) |
| Database | Supabase (Postgres) |
| Auth | Client-side JWT (HS256 via WebCrypto) + PBKDF2 password hashing — no backend server |
| Runtime | Single instance: Vite dev server / static host (no separate API process) |
| Deployment | Netlify (`netlify.toml`, SPA redirect) |

No routing library — navigation is state-driven via an `activeTab` value in `App.tsx`.

---

## Project Structure

```
Constructionmartshk/
├── App.tsx                     # Root: auth gate, navigation, dashboard, moderation, state
├── index.tsx                   # React entry point
├── index.html                  # HTML shell + Tailwind CDN
├── types.ts                    # Shared TypeScript interfaces / enums
├── metadata.json               # AI/agent capability metadata
├── vite.config.ts              # Vite config + env injection (define)
├── netlify.toml                # Netlify build & SPA redirect
├── setup.sql                   # Supabase schema (run once in SQL editor)
├── .env.example                # Required environment variables
├── services/
│   ├── auth.ts                 # Auth store, useAuth hook (login/register/logout/me, super admin seeding)
│   ├── admin.ts                # Super admin operations (users + job listings)
│   ├── jwt.ts                  # HS256 JWT sign/verify + PBKDF2 password hashing (WebCrypto)
│   ├── store.ts                # Data store: Supabase (auth_users / jobs) + localStorage fallback
│   ├── supabase.ts             # Supabase client (bookings, submissions, CRUD)
│   └── geminiService.ts        # Gemini AI (description + vendor match)
├── components/
│   ├── AuthScreen.tsx          # Login / Register UI (all roles, phone + password)
│   ├── SuperAdminPanel.tsx     # Super admin console (users + job listing management)
│   ├── (portal components)     # Construction / Interior / Society sub-portals
│   ├── (role components)       # Per-user-type dashboards, profiles, forms
│   ├── (shared components)     # Charts, chat, payments, carousel, admin
│   └── (profile components)    # ClientProfile, VendorProfile, etc.
└── src/assets/images/          # Role symbols, logo, carousel images
```

---

## User Types (Roles)

Defined by the `UserRole` enum in `types.ts`. The registration screen presents 9 role cards (all user types, including Channel Partner).

| Role | Identity | Key features offered |
| --- | --- | --- |
| **CLIENT (Developer)** | Post civil projects, hire services | Create project, receive AI description, vendor bidding, assignment, milestone payments |
| **VENDOR (Contractor)** | Bid on projects, manage rates | Vendor profile, activity/material rate panels, quotation generator, get matched to projects |
| **PMC** (Project Management Consultant) | Oversee quality | Dashboard, snag/audit tracking (`AuditSnag` severity model) |
| **LABOUR / Sub-Contractor** | Offer daily labour | Labour profile, Instant Labour booking (hourly), daily rates |
| **MATERIAL_SUPPLIER** | Sell building materials | Supplier dashboard, material rates, order quotations, supply radius |
| **JOB (Engineer/Candidate)** | Find placements | Job vacancy carousel, profile with expected salary |
| **FREELANCER** | Independent specialists | Hourly / per-sq.ft rates, skill set (Revit, AutoCAD) |
| **BROKER (Real Estate)** | Property transactions | Brokers Point property listings, ROI %, buy/sell/invest, MAHARERA commission |
| **CHANNEL_PARTNER** | (Enumerated but consolidated under Broker/Developer in UI) | Strategic vendor matching via AI |

---

## Authentication & JWT (Standalone / Single Instance)

There is **no separate auth server**. Everything runs in the browser on the single deployed instance — Vite in dev, or any static host in production.

### How it works
- **Registration** — `registerUser` in `services/auth.ts`. Required fields: `name`, `phone`, `role` (one of the 9 user roles) and `password`. Optional: email, city, company, category, experience, charges, GST. Passwords are hashed in-browser with **PBKDF2 (SHA-256, 100k iterations)** and stored as `salt:hash` in the `auth_users` table (or localStorage). Duplicate phones are rejected; the reserved super admin phone cannot register.
- **Login** — `loginUser(phone, password)` verifies the stored hash, then issues a **real HS256 JWT** signed with WebCrypto (`services/jwt.ts`), `exp` 7 days.
- **Session** — `useAuth` keeps the token (`cm_token`) and user (`cm_user`) in localStorage via a shared store (`useSyncExternalStore`). On load it verifies the JWT against the stored users.
- **App gate** — `App.tsx`: not logged in → `AuthScreen`; super admin → `SuperAdminPanel`; otherwise the role dashboard derived from `user.role`.

### Super Admin
- Seeded automatically on first load: **phone `9000000000` / password `superadmin123`** (overridable via `VITE_SUPERADMIN_PHONE` / `VITE_SUPERADMIN_PASSWORD`). This phone is rejected on the registration form.
- `SuperAdminPanel` (`services/admin.ts` backs it) provides an **Overview** (totals, blocked count, open jobs, users-by-role), a **Users** tab (search, role filter, block/unblock, change role, delete — the super admin account is protected from deletion), and a **Job Listings** tab (change status Open/Closed/Filled, delete).

### Storage
`services/store.ts` persists users to the Supabase `auth_users` table and jobs to the `jobs` table (anon key + RLS). It always **mirrors to localStorage** (`cm_users_store`, `cm_jobs_store`) as a fallback, so the app is fully standalone — run `setup.sql` in your Supabase SQL editor to persist across browsers/devices.

### Security caveat
Because signing happens client-side, the JWT secret ships with the bundle. This is acceptable for a demo/standalone marketplace but is **not** hardened security — for real-world auth, move signing server-side.

---

## Modules / Features

### 1. Dashboard
- Role-aware landing view with greeting and role-specific statistics.
- Monthly activity charts (Recharts bar/line) per role.
- Client spend breakdown by payment status.
- Admin user sees moderation panels for bookings, labours, and submissions.

### 2. Project Creation & AI Assistance
- Client creates a project from a rough idea (`handleCreateProject` in `App.tsx`).
- `AIAssistant` uses Gemini `generateProjectDescription` to turn a rough idea into a professional 100-word description.
- Project is saved as a service request (Supabase + localStorage) and an admin system message is auto-sent.
- Simulated vendor bid appears after ~4 s (e.g., Apex General Contractors @ ₹1,38,000) and project moves to `Bid Submitted`.
- Client assigns a vendor → project becomes `In Progress`; payment marks it `Paid`.

### 3. AI Strategic Vendor Matching
- `geminiService.findStrategicMatch` recommends the best vendor type / skills for a given project description against available vendor profiles.

### 4. Messaging / Chat
- `ChatWindow`: 600px panel, auto-scroll, role icons.
- `handleSendMessage` sends client messages and returns a simulated support reply.
- Chat roles: admin, client, vendor, channel partner (optionally tied to a `projectId`).

### 5. Quotation Generator
- `QuotationGenerator` builds quotations from Activity Rates + Material Rates items.
- Shows itemised totals, importable logo, and a print (printer icon).

### 6. Market & Vendor Rates
- `RateExplorer`: tabbed Activities / Materials explorer across 9 categories with region filter (Mumbai/Delhi) and keyword-based category matching.
- `VendorRatesPanel`: per-vendor activity and material rate add/remove with region filter.

### 7. Construction Services Portal
- `ConstructionServicesPortal` — a hub with three sub-portals:
  - **ConstructionSection**: Part_A / Part_B toggle; sub-tabs for engineers, labours, vendors, materials, machines, vehicles.
  - **InteriorSection**: 5 interior & renovation sub-tabs.
  - **SocietySection**: 5 building-society services, with Recharts bar charts.

### 8. Instant Labours
- `InstantLaboursSection`: `HourlyBooking` with time slots (`1_day_before`, `2nd_half`, `night_work`) and lifecycle status (`broadcasting` → `confirmed_by_labor` → `finalized`).
- Default Carpentry Team at ₹850/day.

### 9. Supplier Dashboard
- `MaterialItem` catalogue (e.g., UltraTech Cement ₹410/bag).
- Order quotations with statuses (`Quote Submitted` / `Pending Quote`).

### 10. Brokers Point
- Property listings priced in Lakhs with expectedYield ROI %.
- Buy / Sell / Invest actions; submissions via `saveSubmission`.

### 11. Payment Modal
- 3-step flow: **Details → Processing (2s) → Success**.
- `serviceFee = budget × 10%`, `vendorPayout = budget − fee`.

### 12. Admin Panel
- Bookings table + Labour table (Trade/Skill, Experience, Daily Rate, Contact/Region, Status).
- Full submissions moderation (view / remove).

### 13. Role Profiles
One profile component per role, each with a mock persona — e.g. Client ("Ankit Sharma, Sharma Builders & Developers"), Vendor ("Vikram Malhotra"), Supplier ("Rajesh Gupta"), Broker ("Prime Crest Real Estate — MAHARERA A51800029311"), Freelancer ("Er. Anand V. Kulkarni, ₹1,500/hr").

### 14. AI Assistant
- Client mode → Gemini project description generation.
- Vendor mode → chat with contextual text (mentions the 10% platform fee).

---

## Data Model (`types.ts`)

Key types and enums:

- **UserRole** — `CLIENT, VENDOR, PMC, CHANNEL_PARTNER, LABOUR, MATERIAL_SUPPLIER, JOB, FREELANCER, BROKER`
- **ServiceType** — `CONSTRUCTION, INTERIOR, BUILDING_SOCIETY, HOME, PLACEMENT`
- **PaymentStatus** — `PENDING, PAID, RELEASED`
- **Project** — client project record with budget, service type, status, assignments.
- **User / Client / Vendor / ChannelPartner** — role-specific profiles (Vendor has region, experience, contractTypes, laborStrength).
- **ActivityRate / MaterialRate** — market pricing used by RateExplorer and QuotationGenerator.
- **Quotation / QuotationItem** — generated quotations.
- **ChatMessage** — sender role + optional `projectId`.
- **MonthlyStat / WhatsappContact** — dashboard stats and contact directory.

---

## Persistence Layer (`services/supabase.ts`)

- `supabase` client from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.
- **saveSubmission** — back-end writes to a type-specific table (`contacts`, `registrations`, `properties`, `jobs`, `applications`, `service_requests`) and to a generic `submissions` table, then always mirrors to localStorage key `const_mart_local_${type}s` for offline/demo resilience.
- **saveBooking / fetchAllBookings / removeBooking** — CRUD on `bookings`, mirrored to `submissions`.
- **fetchAllSubmissions / removeSubmission** — admin moderation.
- All functions are defensive (try/catch, returns `[]`) so the UI never breaks when Supabase is unreachable — the app degrades gracefully to localStorage.

## AI Integration (`services/geminiService.ts`)

- `generateProjectDescription(prompt, serviceType)` — turns a client's rough idea into a concise professional project description.
- `findStrategicMatch(projectDesc, vendorProfiles)` — recommends the best vendor type/skills in 2 sentences.
- Uses `gemini-2.5-flash` via the `@google/genai` SDK.

---

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```
# Client (browser)
GEMINI_API_KEY=            # Gemini API key
VITE_SUPABASE_URL=         # https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=    # Supabase anon (public) key
GOOGLE_MAPS_PLATFORM_KEY=  # Optional: Google Maps

# Standalone auth (client-side JWT)
VITE_JWT_SECRET=           # Secret for signing in-browser JWTs (change to any random string)
VITE_SUPERADMIN_PHONE=     # Seeded super admin phone (default 9000000000)
VITE_SUPERADMIN_PASSWORD=  # Seeded super admin password (default superadmin123)
```

Notes:

- Vite exposes variables prefixed with `VITE_` to the browser; `GEMINI_API_KEY` is injected at build time by `vite.config.ts` (`define`).
- The Gemini call runs in the browser, so the key is technically exposed to clients — for production, move it behind a serverless function (Netlify Functions).
- The Supabase anon key is safe for the browser when combined with RLS policies; never ship a service-role key in the client.
- Auth is fully client-side (JWT signed with `VITE_JWT_SECRET` in the browser) — see the security caveat in the Authentication section.

---

## Setup & Run

```bash
npm install
cp .env.example .env        # fill in values
npm run dev                 # single dev instance on :3000
npm run typecheck           # TypeScript check
npm run build               # production client build -> dist/
npm run preview             # preview the client build
```

First-time database setup (for persistence across browsers/devices):

1. Open your Supabase project → SQL Editor.
2. Run the contents of `setup.sql` (creates `auth_users` and `jobs` tables + anon RLS policies).
3. Reload the app. The super admin is seeded on first load; sample job listings too.

Netlify: build command `npm run build`, publish dir `dist`, SPA redirect `/* → /index.html`. No separate backend is required — the whole app (auth, data, AI) ships as one static bundle.

---

## Notes & Caveats

- No router — navigation is `activeTab` state; browser back is custom (`goBack` resets to dashboard).
- Anonymous/visitor mode is no longer used — every dashboard is tied to an authenticated user's role. The legacy `RoleSelection` demo screen remains in the codebase but is bypassed by the auth gate.
- Auth + user/job data persist to localStorage when Supabase isn't configured; run `setup.sql` and configure Supabase for cross-device persistence.
- The Services Grid on the client dashboard is intentionally disabled (`{false && ...}`) per product requirement ("WITHOUT SERVICES LOGOS").
- Simulated vendor bidding and support replies are demo-only; wire them to real-time channels for production.
- Payments are a mock 3-step flow; no real gateway is integrated.
- Client-side JWT signing is demo-grade; move signing server-side for production-grade security.