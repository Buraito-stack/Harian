# Harian Monorepo

Monorepo untuk portfolio: frontend (Vite + React + TypeScript + Tailwind) dan backend (Express + TypeScript + Prisma + Postgres). Fokus awal: feed sosial sederhana dengan todo list terintegrasi.

## Struktur
- apps/api: Backend Express + Prisma.
- apps/web: Frontend Vite React + Tailwind.

## Prasyarat
- Node.js >= 18
- PNPM/NPM (instruksi di bawah pakai npm)
- Postgres (lokal atau Docker)

## Setup singkat
1) Install dependency root & workspace:
   npm install
   npm --workspace apps/api install
   npm --workspace apps/web install

2) Salin env:
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env

3) Jalankan migrasi Prisma (setelah Postgres siap):
   cd apps/api
   npx prisma migrate dev

4) Run dev (dua server paralel):
   npm run dev

## Catatan
- API default di port 4000; web di 5173.
- Todo route masih in-memory; ganti ke Prisma ketika DB siap.
- Untuk PWA/mobile: web sudah responsif, bisa lanjut ke React Native/Expo dengan share logic (fetch, types) nanti.
