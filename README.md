# Nebachiv Content App - Production Deploy

Clean deployment version for Hetzner server.

## Setup

1. Clone repository
2. Copy `.env.example` to `.env` and update values
3. `npm install`
4. `npx prisma generate`
5. Import database: `psql < full_database_20250822_162213.sql`
6. `npm run build`
7. `npm start` or use PM2

## Server: 49.12.74.42
