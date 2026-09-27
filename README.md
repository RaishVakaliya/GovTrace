# GovTrace — Real-Time Government Document Process Tracking Platform

GovTrace is a high-assurance, real-time tracking platform engineered for transparent public document workflows, citizen entitlement processing, and inter-departmental adjudication.

Built with **Next.js (App Router)**, **Convex Real-time Backend**, **Passport.js Google OAuth 2.0 Integration**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🏛️ Key Features

1. **Public Tracking Search (No Login Required)**
   - Enter any official tracking ID (e.g. `GT-2026-A891K`) in the hero section to view the real-time milestone stepper, officer remarks, and collection status.
2. **Citizen Portal (`/dashboard`)**
   - View all your submitted applications with visual multi-step vertical or horizontal Progress Steppers.
   - Filter by status and search by tracking ID or document type.
   - Print official verification slips and receipts (`/track/[trackingId]`).
3. **Application Intake Gateway (`/apply`)**
   - Apply for new documents across departments:
     - **Department of State & Civil Registry (DSCR)**: Biometric Passports, National Identity (e-ID), Birth Records.
     - **Federal Transport & Licensing Authority (FTLA)**: Driver Licenses, Vehicle Titles.
     - **Bureau of Land Management & Revenue (BLMR)**: Title Deed Transfers, Cadastral Surveys.
     - **Directorate of Trade & Commercial Affairs (DTCA)**: Commercial Trading Permits, Corporate Filings.
   - Automatically generates a unique, verifiable tracking ID (`GT-2026-XXXXX`).
4. **Department Official Console (`/admin`)**
   - Key operational metrics: Total Assigned, Pending Review, Laser Printing, Ready for Collection.
   - Filterable data table by Department and Status.
   - **Status Update Modal**: Single-click status transitions (e.g., *Submitted* ➔ *Accepted* ➔ *Under Review* ➔ *Approved/Printing* ➔ *Ready for Collection*) with official remarks.
   - **Real-Time Reactive Broadcasting**: When an official advances the status, it immediately syncs across all citizen screens without refreshing.
5. **Passport.js Google OAuth & Role-Based Routing**
   - Secure Google OAuth 2.0 flow via `/api/auth/google` and `/api/auth/google/callback`.
   - Automatic role routing: citizens are directed to `/dashboard` while department officials (`.gov` accounts) route to `/admin`.
   - Includes instant demo switcher for both roles for testing.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Server Components, Route Handlers)
- **Database & Sync**: Convex (`convex/schema.ts`, `convex/documents.ts`, `convex/users.ts`)
- **Authentication**: Passport.js (Google Strategy) + Encrypted JWT Session Cookies (`jose`)
- **Styling**: Tailwind CSS (Tailwind v4 with official government color palette)
- **UI Components**: shadcn/ui (`Card`, `Badge`, `Button`, `Dialog`, `Table`, `Input`, `Select`, `Progress`, `Tabs`)

---

## 📁 Project Structure

```text
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx               # Sign-in with Google + Instant Demo Access
│   ├── (citizen)/
│   │   ├── dashboard/page.tsx           # Citizen Applications List & Live Steppers
│   │   ├── apply/page.tsx               # Online Document Application Gateway
│   │   └── track/[trackingId]/page.tsx  # Deep Tracking Dossier & Printable Slip
│   ├── (admin)/
│   │   └── admin/page.tsx               # Department Officer Console & Adjudication
│   ├── api/auth/
│   │   ├── google/route.ts              # Passport Google OAuth Initiation
│   │   ├── google/callback/route.ts     # Google OAuth Callback & Session Issuance
│   │   ├── me/route.ts                  # Current Authenticated Session
│   │   ├── logout/route.ts              # Session Termination
│   │   └── dev-login/route.ts           # One-Click Role Switcher (Citizen / Official)
│   ├── globals.css                      # Government Portal Design System Tokens
│   ├── layout.tsx                       # Root Layout with ConvexProvider & Navbar
│   └── page.tsx                         # Public Tracking Search Hero & Showcase
├── components/
│   ├── ui/                              # shadcn/ui Component Primitives
│   ├── providers/
│   │   └── convex-client-provider.tsx   # Reactive Convex Provider + Cross-Tab Sync
│   ├── navbar.tsx                       # State Header with Live Mode Switcher
│   ├── footer.tsx                       # Official Transparency & Compliance Footer
│   ├── status-badge.tsx                 # Government-grade Visual Status Badges
│   ├── status-stepper.tsx               # Multi-step Horizontal & Vertical Stepper
│   └── status-update-modal.tsx          # Official Adjudication & Status Transition Modal
├── convex/
│   ├── schema.ts                        # Convex Schema (users, departments, applications, statusLogs)
│   ├── documents.ts                     # Queries, Status Mutations, and Seed Data
│   └── users.ts                         # User Queries and Upsert Mutation
├── lib/
│   ├── auth/
│   │   ├── passport.ts                  # Passport.js Google Strategy Configuration
│   │   └── session.ts                   # JWT Cookie Signing & Verification (jose)
│   ├── store/
│   │   ├── realtime-store.ts            # Reactive Cross-Tab Store (BroadcastChannel)
│   │   └── mock-convex-store.ts         # Initial Seed Applications & Departments
│   └── utils.ts                         # Helper Utilities (cn, formatDate)
└── types/
    └── index.ts                         # Data Models & Application Status Enums
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your Google OAuth credentials in `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=govtrace-super-secure-production-ready-jwt-secret-key-32chars
```

> **Note**: Even without Google OAuth credentials, GovTrace includes an instant one-click test switcher on `/login` and the navigation header, allowing you to test both **Citizen** and **Department Official** roles immediately!

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running with Live Convex Cloud (Optional)
To connect to Convex cloud:
```bash
npx convex dev
```
GovTrace will automatically detect `NEXT_PUBLIC_CONVEX_URL` and route all queries and mutations to your Convex deployment. When running standalone, GovTrace uses its built-in reactive `BroadcastChannel` store with zero external dependencies required!

---

## 🎯 Verification Scenarios to Test

1. **Public Tracking**: On `http://localhost:3000`, click sample ID `GT-2026-A891K` or `GT-2026-X419B` to test the live stepper.
2. **Citizen Submission**: Go to `/apply`, choose a department and document type, submit, and observe the new tracking ID.
3. **Official Status Transition**: Open `/admin` in a new tab or window, select an application, click **Update Status**, advance it to *Ready for Collection*, and click **Save & Broadcast Status**. Observe the live update instantly reflect in the citizen view!
