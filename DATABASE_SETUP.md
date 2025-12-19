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

For production, you'll need to use a cloud database since Vercel's filesystem is read-only. We recommend PostgreSQL:

1. **Set up Vercel Postgres** or another PostgreSQL provider (e.g., Supabase, PlanetScale)
2. **Update Prisma schema** to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Create new migrations** for PostgreSQL:
   ```bash
   npx prisma migrate reset --force
   ```
4. **Run migrations** on the production database

## Migration Commands

After setting up your production database:

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to production
npx prisma migrate deploy
```



## Important Notes

- The local `.env` file should contain: `DATABASE_URL="file:./backend/prisma/prisma/dev.db"`
- Never commit your `.env` file (it's already in `.gitignore`)
- Always use environment variables for production database URLs
- Run `prisma migrate deploy` after setting up your production database

