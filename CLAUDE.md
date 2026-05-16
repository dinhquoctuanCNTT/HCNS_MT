# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HCNS_MT** — Human Capital Management System. Monorepo with three apps (backend, frontend, mobile) and a Python face anti-spoofing module.

## Commands

### Backend
```bash
cd backend
npm run dev      # nodemon watch mode on port 3001
npm start        # production start
```

### Frontend
```bash
cd frontend
npm run dev      # Vite dev server on port 5173
npm run build    # production bundle
npm run preview  # preview production build
```

### Mobile
```bash
cd mobile
npm start        # Expo dev server
npm run android  # Android emulator/device
npm run ios      # iOS simulator
```

### Anti-spoofing (Python)
```bash
cd anti-spoofing
# Activate venv first, then run main.py
```

## Architecture

### Backend (`backend/src/`)

Express.js with ES modules (`"type": "module"` in package.json). Two structural patterns coexist:

- **Legacy pattern**: `controllers/` + `routes/` at the top level (auth, user, attendance)
- **Module pattern**: `modules/<feature>/` with co-located controller, service, routes, validator (workflow, dashboard, report, shift, settings, support, explanation)

New features should follow the **module pattern**.

Route registration is centralized in `src/app.js`. All routes are prefixed with `/api`.

Key infrastructure:
- **Database**: MSSQL via `mssql` — connection pool in `src/config/db.js`, raw SQL queries (no ORM)
- **Auth**: JWT Bearer tokens (`src/utils/jwt.js`), middleware in `src/middlewares/auth.middleware.js`
- **RBAC**: 5-level role hierarchy in `src/config/roles.js` — `admin > director > branch_manager > department_head > employee`. Use `requireRole()` middleware from `src/middlewares/role.middleware.js`
- **File uploads**: Multer (`src/config/multer.js`) + Cloudinary (`src/services/cloudinary.service.js`)
- **Email**: Nodemailer via Brevo SMTP (`src/services/mail.service.js`)
- **Face detection**: `face-api.js` in `src/services/face.service.js`, models downloaded via `npm run download-models`
- **Cron jobs**: `node-cron` in `src/jobs/overdue.job.js`

### Frontend (`frontend/src/`)

React 18 + Vite + TypeScript. Feature-based structure under `src/features/`:

- `auth/` — login, register, Zustand auth store (`auth.store.ts`), role permissions (`auth.permissions.ts`)
- `workflow/` — Kanban board with `@dnd-kit` drag-and-drop
- `admin/` — dashboard, HR modules (Nhân sự: shifts, attendance, approvals)
- `user/` — employee home, profile

Routing: React Router v6 in `src/router/AppRouter.tsx`. Protected routes check auth state; `RoleRoute.tsx` enforces role-based access.

API calls go through `src/api/axiosClient.ts`. Base URL is configured in `src/config/env.ts` from `VITE_API_URL` env var.

### Mobile (`mobile/src/`)

React Native 0.83 + Expo 55, TypeScript. Redux Toolkit for state, React Navigation for routing.

- `navigation/` — tab + stack navigators
- `api/axiosClient.ts` — base URL hardcoded to `192.168.68.100:3001/api` (must match your local WiFi IP for physical device testing)
- Key feature: camera-based attendance with face detection photo upload

### Database

SQL Server (`HCNS_MT` database). Schema in `database.sql`. No ORM — all queries are raw SQL via the `mssql` connection pool. Database config: `backend/src/config/db.js`.

## Environment Setup

**Backend** — create `backend/.env`:
```
PORT=3001
DB_USER=...
DB_PASSWORD=...
DB_SERVER=...        # SQL Server hostname
DB_NAME=HCNS_MT
DB_PORT=1433
JWT_SECRET=...
CLOUDINARY_URL=...
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USER=...
MAIL_PASS=...
CLIENT_URL=http://localhost:5173
FRONTEND_PATH=...   # path to frontend/dist for static serving
```

**Frontend** — create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:3001
```

**Mobile** — update `mobile/src/api/axiosClient.ts` with your machine's local IP for device testing.

## Key Conventions

- Backend uses ES modules (`import`/`export`), not CommonJS
- Frontend TypeScript; backend plain JavaScript
- Vietnamese naming used throughout UI labels and some file/folder names (e.g., `CaLamViec` = shifts, `ChamCong` = attendance, `GiaiTrinh` = explanation/leave)
- Workflow module has a `repositories/` layer for DB queries; other modules mix DB calls directly in services
