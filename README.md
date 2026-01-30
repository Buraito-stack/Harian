
# Harian Monorepo

Harian is a monorepo portfolio project featuring a modern social feed with an integrated todo list. It consists of a fullstack web app: frontend (Vite + React + TypeScript + Tailwind) and backend (Express + TypeScript + Prisma + PostgreSQL).

## Structure
- `apps/api`: Express backend with Prisma ORM.
- `apps/web`: Vite React frontend with Tailwind CSS.

## Prerequisites
- Node.js >= 18
- NPM or PNPM (examples below use npm)
- PostgreSQL (local or Docker)

## Quick Setup
1. Install dependencies for root and workspaces:
   ```sh
   npm install
   npm --workspace apps/api install
   npm --workspace apps/web install
   ```

2. Copy environment variables:
   ```sh
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   ```

3. Run Prisma migrations (after PostgreSQL is ready):
   ```sh
   cd apps/api
   npx prisma migrate dev
   ```

4. Start development (both servers in parallel):
   ```sh
   npm run dev
   ```

## Notes
- API runs on port 4000; web runs on 5173 by default.
- Todo routes are in-memory for now; will migrate to Prisma/DB soon.
- The web app is responsive and ready for PWA/mobile. Future plans include React Native/Expo with shared logic (fetch/types).
