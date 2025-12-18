# Database Setup Guide

## Problem
SQLite file-based databases don't work on Vercel because the filesystem is read-only. You need to use a cloud database for production.

## Solution
The Prisma schema has been updated to use the `DATABASE_URL` environment variable.

## Local Development Setup

1. Create a `.env` file in the root directory:
```bash
DATABASE_URL="file:./backend/prisma/prisma/dev.db"
```

   Note: The path is relative to where you run the Prisma commands. If you run from the root, use `file:./backend/prisma/prisma/dev.db`

2. The database file will be created automatically when you run migrations.

## Production Setup (Vercel)

You have two options:

### Option 1: Turso (Cloud SQLite) - Recommended ⭐

Turso provides a cloud-hosted SQLite database that's compatible with your existing schema.

1. **Sign up for Turso**: https://turso.tech
2. **Create a database** in the Turso dashboard
3. **Get your database URL** from the Turso dashboard
4. **Add environment variable in Vercel**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `DATABASE_URL` with your Turso database URL (format: `libsql://your-db.turso.io`)
   - Add `TURSO_AUTH_TOKEN` (get this from Turso dashboard)

5. **Run migrations on Turso**:
   ```bash
   # Install Turso CLI
   npm install -g @libsql/client
   
   # Or use the Turso CLI to sync your local database
   turso db shell your-database-name
   ```

### Option 2: PostgreSQL (Requires Schema Migration)

If you prefer PostgreSQL, you'll need to:

1. **Set up Vercel Postgres** or another PostgreSQL provider
2. **Update Prisma schema** to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Create new migrations** for PostgreSQL
4. **Run migrations** on the production database

## Migration Commands

After setting up your production database:

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to production
npx prisma migrate deploy
```

## Quick Start with Turso

1. Install Turso CLI: `npm install -g @libsql/client` or follow [Turso docs](https://docs.turso.tech)
2. Create database: `turso db create your-database-name`
3. Get URL: `turso db show your-database-name --url`
4. Get auth token: `turso db tokens create your-database-name`
5. Add to Vercel environment variables:
   - `DATABASE_URL` = your Turso URL
   - `TURSO_AUTH_TOKEN` = your auth token

## Important Notes

- The local `.env` file should contain: `DATABASE_URL="file:./backend/prisma/prisma/dev.db"`
- Never commit your `.env` file (it's already in `.gitignore`)
- Always use environment variables for production database URLs
- Run `prisma migrate deploy` after setting up your production database

