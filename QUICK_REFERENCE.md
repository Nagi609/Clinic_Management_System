# Quick Reference Guide

## 🚀 Start the App
```bash
cd clinic-management-system
pnpm dev
```
Visit: http://localhost:3000

## 📝 Test Flow

### 1. **Sign Up** (http://localhost:3000/signup)
- Full Name: Any name
- Email: unique@email.com
- Password: Must have:
  - At least 8 characters
  - 1 uppercase letter (A-Z)
  - 1 number (0-9)
  - 1 special character (!@#$%^&*)
- Example: `MyPassword123!`
- Click "Create Account"

### 2. **You're Sent to Login** ✓ (http://localhost:3000/login)
- Enter the email and password you just created
- Click "Login"

### 3. **Access Dashboard** ✓ (http://localhost:3000/dashboard)
- You should now see the dashboard

### 4. **Close Browser & Reopen**
- Go to http://localhost:3000/login
- **Result**: You're back at login (session not persistent yet)
- Log in again with your credentials
- **Result**: Your account still exists! ✓ (Data persists)

---

## 🔐 How It Works

### Signup Flow
```
Form Submission 
    ↓
Frontend Validation (8+ chars, uppercase, number, special char)
    ↓
Send to API: POST /api/auth/signup
    ↓
Backend: Check if email exists in database
    ↓
Backend: Hash password with bcryptjs
    ↓
Backend: Save user to database
    ↓
Redirect to Login Page
```

### Login Flow
```
Form Submission
    ↓
Frontend Validation (email format, password not empty)
    ↓
Send to API: POST /api/auth/login
    ↓
Backend: Find user by email in database
    ↓
Backend: Compare passwords (hashed vs input)
    ↓
If match: Return user data
    ↓
Frontend: Save user to localStorage
    ↓
Redirect to Dashboard
```

---

## 📁 Database Info

**Location**: `prisma/dev.db` (SQLite file)

**View Database**:
1. Download: https://sqlitebrowser.org/
2. Open `prisma/dev.db`
3. Click on "User" table to see all accounts

**Reset Database**:
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
```

---

## 🐛 Common Issues

### "Port 3000 is in use"
```bash
taskkill /F /IM node.exe
pnpm dev
```

### Accounts not showing up
- Check if API is returning errors (look at Network tab in DevTools)
- Delete database and recreate: `rm prisma/dev.db && npx prisma migrate dev --name init`

### Password hashing errors
- Make sure bcryptjs is installed: `pnpm install bcryptjs`

---

## ✅ What Was Fixed

| Problem | Solution |
|---------|----------|
| Data lost on refresh | Now stored in SQLite database |
| Signup → Dashboard wrong | Changed to Signup → Login → Dashboard |
| Passwords as plain text | Now hashed with bcryptjs |
| No backend validation | Added API validation |

---

## 📚 File Locations

- Signup Page: `app/(auth)/signup/page.tsx`
- Login Page: `app/(auth)/login/page.tsx`
- Signup API: `app/api/auth/signup/route.ts`
- Login API: `app/api/auth/login/route.ts`
- Database Schema: `prisma/schema.prisma`
- Database Client: `lib/db.ts`

