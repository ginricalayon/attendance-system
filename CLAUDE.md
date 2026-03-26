# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A student attendance tracking system built as a monolithic Next.js application (v16) with Firebase backend. Handles student management, event creation, barcode-based attendance recording, and reporting/statistics.

## Commands

```bash
pnpm dev          # Start dev server on localhost:3000
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

No test framework is configured.

## Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19, TypeScript
- **Database/Auth/Storage:** Firebase (Firestore, Auth, Cloud Storage) via both client SDK and Admin SDK
- **State:** Zustand (client state), TanStack React Query (server state, 5min stale time)
- **Forms:** React Hook Form + Zod validation
- **UI:** Shadcn/ui + Radix primitives, Tailwind CSS 4, Recharts for charts
- **HTTP:** Axios with global interceptors (401 → "session-expired" event)

### Routing & Auth
- **Route groups:** `app/(protected)/` requires auth, `app/(public)/` is open
- **Auth flow:** Firebase Auth → POST `/api/auth/login` → Firebase Admin verifies token → HTTP-only cookie (`token`) set for session
- **Middleware** (`middleware.ts`): checks `token` cookie, redirects unauthenticated users to `/login`, blocks unauthorized API requests with 401
- **API route protection:** `requireAuth` HOF in `app/lib/middleware/auth.ts` wraps protected endpoints, verifies token from cookie or Authorization header

### API Pattern
Routes follow `/api/[resource]/[action]/route.ts`. Standard response shape:
```json
{ "success": true, "data": {}, "pagination": { "page": 1, "limit": 20, "total": 100 } }
```
Errors use a custom `ApiError` class with `statusCode` and `code` fields, handled by `handleError()`.

### Key Directories
- `app/lib/services/` — Business logic (student, attendance, event, settings services) using Firestore Admin SDK
- `app/lib/schema/` — Zod schemas for request/response validation
- `app/lib/firebase/` — Firebase initialization (client: `client.ts`, admin: `admin.ts` singleton)
- `app/stores/slices/` — Zustand store slices
- `lib/` (root) — Axios instance (`api.ts`), React Query client (`query-client.ts`), query key factory (`query-keys.ts`)
- `components/ui/` — Shadcn/ui components

### Import Alias
`@/*` maps to the project root (e.g., `@/lib/api`, `@/app/lib/services/student-service`).

### Environment Variables
- `NEXT_PUBLIC_FIREBASE_*` — Client-side Firebase config (public)
- `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` — Server-only Admin SDK credentials
- `NEXT_PUBLIC_API_URL` — API base URL (defaults to relative `/api`)

### Firestore Collections
`students`, `events`, `attendance`, `event_stats`, `settings`

### Notable Config
- React Compiler enabled in `next.config.ts`
- `xlsx` marked as server-external package
- React Query retries 3x but skips 4xx errors (except 429)
