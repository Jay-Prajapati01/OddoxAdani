# 🚀 Supabase Setup Guide - GearGuard

## Overview

This guide will help you set up Supabase for authentication and database management. Users can register on one browser and access their data from any other browser/device.

---

## Step 1: Create a Supabase Project

1. **Go to** https://supabase.com
2. **Click** "Start your project"
3. **Sign in** with GitHub (or create account)
4. **Click** "New Project"
5. **Fill in:**
   - Project Name: `gearguard-hackathon`
   - Database Password: `[Generate a strong password]`
   - Region: `Choose closest to you`
6. **Click** "Create new project"
7. **Wait** 1-2 minutes for project initialization

---

## Step 2: Get Your API Keys

1. In your project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these two values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Keep these safe - you'll add them to your `.env` file

---

## Step 3: Configure Authentication

### Enable Email Authentication

1. Go to **Authentication** → **Providers** in sidebar
2. Find **Email** provider
3. **Enable** if not already enabled
4. **Disable** "Confirm email" (for hackathon speed)
   - In production, you'd keep this enabled
5. **Save** changes

### Configure Email Settings (Optional for Development)

For hackathon purposes, you can skip email verification:
1. Go to **Authentication** → **URL Configuration**
2. Site URL: `http://localhost:8080`
3. Redirect URLs: Add `http://localhost:8080/**`

---

## Step 4: Create Database Tables

### User Profiles Table

1. Go to **SQL Editor** in sidebar
2. Click **New query**
3. Paste this SQL:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Equipment Table (Example)

```sql
-- Create equipment table
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'operational',
  serial_number TEXT,
  purchase_date DATE,
  last_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own equipment
CREATE POLICY "Users can view own equipment"
  ON equipment
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own equipment
CREATE POLICY "Users can insert own equipment"
  ON equipment
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own equipment
CREATE POLICY "Users can update own equipment"
  ON equipment
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own equipment
CREATE POLICY "Users can delete own equipment"
  ON equipment
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Maintenance Requests Table

```sql
-- Create maintenance_requests table
CREATE TABLE maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'corrective',
  status TEXT DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  assigned_to TEXT,
  scheduled_date DATE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON maintenance_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create requests
CREATE POLICY "Users can create requests"
  ON maintenance_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their requests
CREATE POLICY "Users can update own requests"
  ON maintenance_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their requests
CREATE POLICY "Users can delete own requests"
  ON maintenance_requests
  FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Step 5: Set Up Environment Variables

1. In your project root, create `.env.local` file:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Replace with your actual values from Step 2

3. Add to `.gitignore` (if not already there):

```
.env.local
.env
```

---

## Step 6: Verify Setup

### Test in Supabase Dashboard

1. Go to **Table Editor**
2. You should see:
   - `user_profiles` table
   - `equipment` table
   - `maintenance_requests` table
3. All should show "RLS enabled" ✓

### Test Authentication Flow

Once your frontend is set up:

```
1. Sign up with email/password → Creates auth.users entry
2. Trigger fires → Creates user_profiles entry
3. User can only access their own data (RLS enforced)
4. Login from different browser → Same data appears
```

---

## Understanding Row Level Security (RLS)

### What is RLS?

Row Level Security ensures users can only access their own data. Without RLS, anyone could query all data.

### Our Policies Explained

```sql
-- This means: Show only rows where user_id matches the logged-in user
USING (auth.uid() = user_id)

-- This means: Allow insert only if user_id matches the logged-in user
WITH CHECK (auth.uid() = user_id)
```

### Why This Is Secure

- **Backend enforced**: Even if someone hacks your frontend, they can't access other users' data
- **Automatic**: Supabase checks permissions on every query
- **Zero-trust**: No data leaks even if your SQL is exposed

---

## Common Issues & Solutions

### Issue: "relation 'user_profiles' does not exist"
**Solution**: Run the CREATE TABLE SQL again in SQL Editor

### Issue: "new row violates row-level security policy"
**Solution**: Check that `user_id` matches `auth.uid()`

### Issue: "JWT expired"
**Solution**: User's session expired, call `supabase.auth.refreshSession()`

### Issue: Can't insert data
**Solution**: Verify RLS policies allow INSERT for authenticated users

---

## Production Checklist

Before deploying:

- [ ] Enable email confirmation
- [ ] Set up custom domain
- [ ] Configure production redirect URLs
- [ ] Enable 2FA for Supabase account
- [ ] Set up database backups
- [ ] Review and test all RLS policies
- [ ] Add rate limiting (Supabase Pro)
- [ ] Set up monitoring/alerts

---

## Next Steps

Now that Supabase is configured:

1. ✅ Supabase project created
2. ✅ Authentication enabled
3. ✅ Database tables created
4. ✅ RLS policies set up
5. ✅ Environment variables configured

**Continue to**: Implementation in `src/lib/supabase.ts` and `src/contexts/AuthContext.tsx`

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Auth Guide**: https://supabase.com/docs/guides/auth
- **Database Guide**: https://supabase.com/docs/guides/database
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

---

## Support

If you get stuck:
1. Check Supabase logs: **Logs & Analytics** in dashboard
2. Test queries in SQL Editor
3. Use Supabase Discord: https://discord.supabase.com

Good luck with your hackathon! 🚀
