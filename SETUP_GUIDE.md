# Step-by-Step Database Setup Guide

## Step 1: Set Up Local Development Environment

### 1.1 Create `.env` file
Create a file named `.env` in the root directory of your project (same level as `package.json`).

### 1.2 Add Database URL
Open `.env` and add this line:
```
DATABASE_URL="file:./backend/prisma/prisma/dev.db"
```

### 1.3 Verify Local Setup
Run this command to test:
```bash
npx prisma generate
```

If it works without errors, your local setup is complete!

---

## Step 2: Set Up Production Database (Optional)

For local development, the file-based SQLite database is sufficient. For production deployment (e.g., Vercel), you'll need a cloud database since Vercel's filesystem is read-only.

### Option 1: PostgreSQL (Recommended for Production)
1. Set up a PostgreSQL database (Vercel Postgres, Supabase, PlanetScale, etc.)
2. Get your database connection URL
3. Update your Prisma schema to use PostgreSQL:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Create new migrations: `npx prisma migrate reset --force`
5. Run migrations on production: `npx prisma migrate deploy`

### Option 2: Keep SQLite for Production (Not Recommended)
If you must use SQLite in production, you'll need a persistent file storage solution or use a different hosting platform that supports file-based databases.

---

## Step 3: Prepare Your Database Schema

### 3.1 Generate Prisma Client
Make sure your Prisma client is up to date:
```bash
npx prisma generate
```

### 3.2 (Optional) Test Connection Locally
You can test the connection by temporarily setting your local `.env` to your production database URL, then run:
```bash
npx prisma migrate deploy
```

**Note**: After testing, change your local `.env` back to the file-based URL for local development.

---

## Step 4: Configure Vercel

### 4.1 Go to Vercel Dashboard
1. Go to https://vercel.com
2. Log in to your account
3. Select your project (Clinic_Management_System)

### 4.2 Navigate to Environment Variables
1. Click on your project
2. Go to **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)

### 4.3 Add DATABASE_URL
1. Click **Add New**
2. **Key**: `DATABASE_URL`
3. **Value**: Your production database connection URL (from your cloud provider)
4. **Environment**: Select **Production**, **Preview**, and **Development** (or at least Production)
5. Click **Save**

### 4.4 Verify Environment Variables
You should now see:
- `DATABASE_URL`

---

## Step 5: Run Migrations on Production Database

### 5.1 Option A: Using Turso CLI (Recommended)
Run this command to apply migrations:
```bash
turso db shell clinic-management
```

Then in the shell, you can run SQL commands. However, it's easier to use Prisma:

### 5.2 Option B: Using Prisma Migrate
Set your environment variables temporarily:
```bash
# Windows PowerShell
$env:DATABASE_URL="libsql://your-database-url.turso.io"
$env:TURSO_AUTH_TOKEN="your-auth-token"

# Then run
npx prisma migrate deploy
```

Or create a temporary `.env.production` file:
```
DATABASE_URL="libsql://your-database-url.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

Then run:
```bash
npx prisma migrate deploy
```

**Note**: After running migrations, you can delete the temporary file.

---

## Step 6: Deploy to Vercel

### 6.1 Commit Your Changes
Make sure all your changes are committed:
```bash
git add .
git commit -m "Configure database for production"
git push
```

### 6.2 Trigger Deployment
1. Go to your Vercel dashboard
2. Your project should auto-deploy when you push
3. Or manually trigger: Go to **Deployments** → Click **Redeploy**

### 6.3 Monitor the Build
Watch the build logs to ensure:
- ✅ Build completes successfully
- ✅ No database connection errors
- ✅ Migrations run (if you added `prisma migrate deploy` to build script)

---

## Step 7: Verify Everything Works

### 7.1 Check Your Deployed App
1. Visit your Vercel deployment URL
2. Try to use the app (login, create records, etc.)
3. Check for any database errors in the browser console

### 7.2 Check Vercel Logs
1. Go to Vercel dashboard → Your project
2. Click **Logs** tab
3. Look for any Prisma or database errors

### 7.3 Test Database Connection
If you have API routes that query the database, test them to ensure they work.

---

## Troubleshooting

### Issue: "Unable to open the database file"
**Solution**: Make sure `DATABASE_URL` is set in Vercel environment variables.

### Issue: "Authentication failed"
**Solution**: Verify your database credentials are correct in Vercel environment variables.

### Issue: "Migration failed"
**Solution**:
1. Make sure migrations are run: `npx prisma migrate deploy`
2. Check that your production database is accessible
3. Verify your database URL format is correct

### Issue: "Table doesn't exist"
**Solution**: Run migrations on your production database:
```bash
# Set environment variables
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

---

## Quick Reference

### Vercel Environment Variables Needed
- `DATABASE_URL` = Your production database connection URL

### Local Development
Keep your `.env` file with:
```
DATABASE_URL="file:./backend/prisma/prisma/dev.db"
```

---

## Need Help?

- **Prisma Documentation**: https://www.prisma.io/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

