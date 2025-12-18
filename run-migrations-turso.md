# How to Run Migrations on Turso

## Option 1: Using Turso CLI (Recommended)

### Step 1: Install Turso CLI
```bash
# Windows (using Scoop)
scoop install turso

# Or download from: https://github.com/tursodatabase/turso-cli/releases
```

### Step 2: Login to Turso
```bash
turso auth login
```

### Step 3: Set Environment Variables Temporarily
```powershell
# In PowerShell, set these temporarily:
$env:DATABASE_URL="libsql://your-database-url.turso.io"
$env:TURSO_AUTH_TOKEN="your-auth-token"
```

### Step 4: Run Migrations
```bash
npx prisma migrate deploy
```

---

## Option 2: Using Prisma Studio (Alternative)

1. Set environment variables in your `.env` file temporarily:
```
DATABASE_URL="libsql://your-database-url.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

2. Run migrations:
```bash
npx prisma migrate deploy
```

3. **Important**: After running migrations, change your `.env` back to:
```
DATABASE_URL="file:./backend/prisma/prisma/dev.db"
```

---

## Option 3: Manual SQL (If needed)

If migrations fail, you can manually run SQL:

1. In Turso dashboard, go to your database
2. Click "Open in SQL Editor" or "Query"
3. Copy SQL from your migration files in `backend/prisma/migrations/`
4. Run them one by one in order

