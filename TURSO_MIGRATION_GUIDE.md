# How to Run Migrations on Turso

## The Problem
Prisma's `migrate deploy` doesn't work directly with Turso's `libsql://` URLs because Prisma's SQLite provider only accepts `file:` URLs.

## Solution: Use Prisma `db push` or Manual SQL

### Option 1: Use `db push` (Easiest) ⭐

This will sync your schema to Turso without using migrations:

1. **Set environment variables in PowerShell:**
```powershell
$env:DATABASE_URL="libsql://your-database-url.turso.io"
$env:TURSO_AUTH_TOKEN="your-auth-token"
```

2. **Push schema to Turso:**
```powershell
npx prisma db push
```

This will create all your tables in Turso based on your Prisma schema.

**Note:** `db push` doesn't use migration files - it directly syncs your schema. This is fine for initial setup.

---

### Option 2: Manual SQL Migration (Recommended for Production)

Run your migrations manually using Turso's SQL editor:

1. **Go to Turso Dashboard** → Your Database → SQL Editor

2. **Run each migration file in order:**

   Open each file in `backend/prisma/migrations/` and run the SQL:
   
   - `20251211134716_add_username/migration.sql`
   - `20251211154148_add_clinic_contact/migration.sql`
   - `20251212102432_update_patient_schema/migration.sql`
   - `20251212120640_add_medical_history_and_emergency_contacts/migration.sql`
   - `20251212133551_add_email_to_patient/migration.sql`
   - `20251215104113_/migration.sql`
   - `20251218121020_change_ids_to_autoincrement/migration.sql` (this one is empty, skip it)
   - `20251218152926_add_user_numeric_id/migration.sql`
   - `20251218193408_revert_ids_to_string/migration.sql` (this one is empty, skip it)

3. **Copy and paste each SQL file's content** into Turso's SQL editor and run it.

---

### Option 3: Use a Migration Script

Create a script that reads migration files and runs them on Turso using the libSQL client.

---

## Recommended Approach

**For now, use Option 1 (`db push`)** - it's the quickest way to get your database set up. You can run migrations manually later if needed.

After running `db push`, your Turso database will have all the tables from your Prisma schema.

