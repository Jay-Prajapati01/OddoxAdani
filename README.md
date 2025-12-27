## GearGuard – Intelligent Maintenance & Asset Management (Oddox Adani Hackathon)

GearGuard is a role-based maintenance and asset management dashboard designed for industrial sites (e.g. large plants / warehouses). It lets admins, managers, technicians, and regular users collaborate on equipment maintenance, track requests, and monitor real-time KPIs – all in a modern, responsive web app.

The project is fully frontend-only (React + TypeScript + Vite) with **localStorage-powered authentication and data persistence**, so it runs anywhere without backend setup – perfect for hackathon demos and offline evaluations.

---

## ✨ Core Highlights

- **Multi‑role experience** out of the box:
	- **Admin** – configure teams, equipment, and global settings.
	- **Manager** – plan and oversee maintenance workload, preventive jobs, and KPIs.
	- **Technician** – manage assigned tasks, update statuses, and track progress.
	- **End User** – submit issues/requests and track their own tickets.
- **Real‑time dashboards** per role (Admin / Manager / Technician / User) with:
	- Live stats for open/closed requests, equipment, team workload, and SLAs.
	- Quick navigation to critical pages (Maintenance Kanban, Teams, Equipment, Calendar).
- **Maintenance Kanban** for the full lifecycle:
	- `new → in_progress → repaired → scrap` with state changes and timestamps.
	- Per-request metadata: priority, due dates, estimated/actual hours, technician assignment.
- **Equipment management**:
	- Central registry of machines, vehicles, IT assets (status, location, department, last maintenance, open request count).
	- Mark equipment as **operational / maintenance / warning / scrapped**.
- **Teams & technicians**:
	- Teams (Mechanics, Electricians, IT Support, …) with members, roles, and status (available / busy / offline).
	- Manager and Admin dashboards use this data to compute team workload.
- **Persistent data without backend**:
	- All key entities (users, maintenance requests, equipment, teams) are stored in `localStorage`.
	- Data survives **page refresh, tab close, and browser restart** on the same device.
- **Polished UI/UX**:
	- Built with **React 18 + TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn/ui** (Radix primitives).
	- Responsive layout, dark/light themes, animated widget transitions, toasts, and modern iconography via `lucide-react`.

---

## 🧱 Project Structure

This repository contains the hackathon project root with the main app inside the `gearguard` folder:

```bash
OddoxAdani/
├─ README.md              # This file (hackathon overview)
└─ gearguard/             # Main GearGuard web app
	 ├─ package.json
	 ├─ vite.config.ts
	 ├─ src/
	 │  ├─ pages/           # Landing, Login, Register, /app/* pages
	 │  ├─ components/      # Layout, dashboard widgets, UI primitives
	 │  ├─ contexts/        # Auth, Maintenance, Equipment, Teams, Settings, etc.
	 │  └─ config/, hooks/, lib/
	 └─ public/
```

---

## 🧩 Tech Stack

**Frontend**
- React 18 + TypeScript (SPA)
- Vite 7 (bundler/dev server)
- React Router v6 (routing)
- Context API for app‑wide state (Auth, Maintenance, Equipment, Teams, Calendar, Settings)

**UI / Styling**
- Tailwind CSS 3 + `tailwindcss-animate`
- shadcn/ui + Radix UI primitives (dialogs, menus, sheets, etc.)
- `lucide-react` for icons
- `recharts` for charts

**State & Forms**
- Custom React Context providers for all domains
- `react-hook-form` + `zod` for forms & validation

**Feedback & UX**
- `sonner` for toasts
- Role-based protected routes and conditional UI

**Build & Quality**
- ESLint with React/TypeScript plugins
- `npm run lint`, `npm run build`, `npm run preview`

---

## 🔐 Authentication & Roles (Frontend‑Only)

Authentication is implemented purely on the frontend using `localStorage`, with no external auth provider required.

- Users are stored in `localStorage` under a GearGuard‑specific key.
- On login, credentials are validated against this local user store.
- The active user session is persisted so that a full page refresh does **not** log the user out.
- Role‑based helpers (e.g. `isRole`, `hasPermission`, `canAccess`) drive which pages and actions are visible.

### Default Demo Accounts

Use these demo logins to explore all roles quickly:

```text
Admin:      admin@company.com      / password
Manager:    manager@company.com    / password
Technician: tech@company.com       / password
User:       user@company.com       / password
```

Each role sees a **different dashboard** and capabilities tailored to real‑world maintenance workflows.

---

## 💾 Data Persistence (localStorage)

To keep the hackathon demo self‑contained and offline‑friendly, GearGuard persists core domain data in `localStorage`:

- **Users & Auth**
	- `gearguard_users` – all registered users
	- `gearguard_user` – currently logged‑in user

- **Maintenance**
	- `gearguard_maintenance_requests` – all maintenance tickets, including:
		- subject, type (corrective/preventive), equipment, category
		- priority, status (`new`, `in_progress`, `repaired`, `scrap`)
		- due dates, estimated & actual hours
		- `createdBy`, `createdAt`, `lastUpdatedBy`, `lastUpdatedAt`

- **Equipment**
	- `gearguard_equipment` – full equipment registry with:
		- serial numbers, departments, locations
		- operational status and open request counts

- **Teams**
	- `gearguard_teams` – maintenance teams and their members
		- members include role, contact, status (available/busy/offline), and mapped `userRole` where relevant

Every context provider reads from `localStorage` on load and writes back whenever data changes, so the UI and the dashboard KPIs always recompute from the latest stored state.

---

## 📊 Role‑Based Dashboards

### Admin Dashboard
- System‑wide view of:
	- Total equipment
	- Number of maintenance teams & members
	- Open vs closed requests
- Quick links:
	- Equipment Management
	- Team Management
	- System Settings

### Manager Dashboard
- Focus on **operational performance**:
	- Open requests and overdue alerts
	- Completed tasks (e.g. repaired today)
	- Preventive maintenance tasks
	- Team workload: assigned vs available capacity
- Quick access to:
	- Maintenance Kanban
	- Calendar view of upcoming preventive jobs

### Technician Dashboard
- "My Workspace" for hands‑on work:
	- Tasks in `new` or `in_progress` assigned to the technician
	- Today’s schedule summary
	- Overdue tasks with days‑overdue badges
	- One‑click link to the Kanban board to update statuses

### User Dashboard
- Simple interface for non‑technical users:
	- Submit new maintenance requests
	- See **only their own** open and completed requests
	- Track the status as technicians and managers update the ticket

---

## 🚀 Getting Started (Cloning & Running Locally)

> Replace `<your-username>` and repository name with your actual GitHub path when publishing.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/OddoxAdani.git
cd OddoxAdani/gearguard
```

### 2. Install Dependencies

Use `npm` (or `pnpm`/`yarn` if you prefer and have a lockfile):

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

By default, Vite serves the app at:

```text
http://localhost:5173/
# or the port shown in your terminal (e.g. 8080 if configured)
```

Open the URL in your browser and log in with one of the **demo accounts** above.

### 4. Build for Production

```bash
npm run build
```

This outputs an optimized static build to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

Vite will serve the built app on a local URL (printed in the terminal).

### 5. Linting

```bash
npm run lint
```

Runs ESLint across the project to help maintain consistent, clean code.

---

## 🧪 Suggested Demo Flow (Judging / Live Demo)

1. **Intro (30–60s)**
	 - Briefly explain that GearGuard is an end‑to‑end maintenance command center for industrial operations, optimized for different roles.

2. **User Flow (2–3 min)**
	 - Log in as `user@company.com`.
	 - Submit a new maintenance request from the User dashboard.
	 - Show that after refresh, the request is still there (localStorage persistence).

3. **Manager Flow (2–3 min)**
	 - Log in as `manager@company.com`.
	 - Highlight the Manager dashboard KPIs updating with the new open request.
	 - Show team workload and upcoming preventive maintenance.

4. **Technician Flow (2–3 min)**
	 - Log in as `tech@company.com`.
	 - Show the same request in the technician’s task list.
	 - Update its status to `in_progress` and then `repaired`, logging actual hours.

5. **Admin Flow (1–2 min)**
	 - Log in as `admin@company.com`.
	 - Add a new piece of equipment and a new team member.
	 - Show how global stats on the Admin dashboard adjust accordingly.

6. **Wrap‑Up (30s)**
	 - Emphasize **no backend dependency**, fast setup, persistent data, and how easily this can be connected to real APIs or IoT sensors in the future.

---

## 🌟 Why This Project Is Hackathon‑Ready & Impactful

- **Realistic problem space** – Industrial maintenance and asset management is a real pain point with huge ROI potential.
- **Clear multi‑persona design** – Each role (Admin/Manager/Technician/User) has a tailored dashboard and actions, mirroring real organizations.
- **Polished UX** – Modern UI, animations, theming, and thoughtful layouts make the app feel production‑grade.
- **Self‑contained demo** – No backend, no database setup, no API keys. The entire experience runs locally in any modern browser.
- **Extensible architecture** – Context‑based domain separation (Auth, Maintenance, Equipment, Teams, Settings) makes it straightforward to swap localStorage for a real backend later.
- **Strong storytelling** – From request creation to closure, the end‑to‑end lifecycle is visible and easy to demonstrate to judges.

---

## 🏁 Summary

GearGuard turns complex maintenance operations into a clean, role‑based experience:

- **Admins** configure the system.
- **Managers** orchestrate workload and preventive care.
- **Technicians** execute and update tasks.
- **End Users** raise issues and stay informed.

All of this is delivered in a single, fast, frontend‑only web app with persistent data and professional UX – ideal for hackathon judging and ready to be extended into a production platform.

If you’d like, I can next help you refine UI copy or prepare a 1–2 minute pitch script aligned with this README.
