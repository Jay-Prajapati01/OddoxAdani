# 🚨 QUICK FIX - Supabase Setup Errors

## Your Current Errors Explained

### ❌ Error 1: "Email address is invalid"
**Cause**: Supabase email validation might be rejecting certain formats

### ❌ Error 2: "Failed to load resource: 400/429"
**Cause**: Rate limiting from too many failed attempts

### ❌ Error 3: "Error fetching user profile"
**Cause**: **The database tables don't exist yet!**

---

## ✅ SOLUTION: Run Database Setup (5 minutes)

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in
3. Select your project: **yjvtvbfnmymbcwtghpyz**

### Step 2: Run This SQL (CRITICAL)

1. Click **SQL Editor** in left sidebar
2. Click **New query**
3. **Copy and paste this ENTIRE SQL block**:

```sql
-- ============================================
-- USER PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT CHECK (role IN ('manager', 'technician', 'admin', 'user')),
  avatar_url TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role, company)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'company'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATE TIMESTAMP FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.user_profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

4. Click **Run** (bottom right)
5. You should see: ✅ **"Success. No rows returned"**

### Step 3: Verify Tables Created

1. Click **Table Editor** in left sidebar
2. You should see: **user_profiles**
3. The table should have columns: id, email, name, role, avatar_url, company

### Step 4: Fix Email Validation (Important!)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Find **"Confirm email"** toggle
4. **Turn it OFF** (for development)
   - This disables email verification
   - Users can sign up without confirming email
5. Click **Save**

### Step 5: Disable Rate Limiting (For Development)

1. Still in **Authentication** → **Settings**
2. Scroll to **Rate Limits**
3. Increase limits or disable temporarily:
   - Email signups per hour: **100**
   - Password signins per hour: **100**
4. Click **Save**

### Step 6: Test Registration

1. **Stop your dev server** (Ctrl+C)
2. **Clear browser cache and cookies** (Important!)
3. **Restart**: `npm run dev`
4. Go to http://localhost:8080/register
5. Try registering with:
   - Name: `Test User`
   - Email: `testuser@example.com` (use valid format!)
   - Company: `Test Corp`
   - Role: `Manager`
   - Password: `password123`
6. Should work now! ✅

---

## 🔍 Debugging Checklist

### If Still Getting Errors:

#### Error: "relation 'user_profiles' does not exist"
- ❌ You didn't run the SQL yet
- ✅ Go back to Step 2 and run the SQL

#### Error: "Email address is invalid"
- ❌ Using fake email like "manager@gmail.com" without proper domain
- ✅ Use format: `yourname@gmail.com` or `test@example.com`
- ✅ Disable email confirmation in Step 4

#### Error: "For security purposes, you can only request this after 56 seconds"
- ❌ Rate limited from too many attempts
- ✅ Wait 60 seconds
- ✅ Disable rate limiting in Step 5
- ✅ Clear browser cookies

#### Error: "Failed to load resource: 400"
- ❌ Supabase URL or Key is wrong
- ✅ Check `.env` file has correct values from dashboard
- ✅ Restart dev server after changing `.env`

#### Error: "Failed to fetch" or Network Error
- ❌ Internet connection issue
- ❌ Supabase project is paused/deleted
- ✅ Check if https://yjvtvbfnmymbcwtghpyz.supabase.co is accessible

---

## 🎯 Quick Test Commands

### Test Supabase Connection
Open browser console and run:
```javascript
const response = await fetch('https://yjvtvbfnmymbcwtghpyz.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdnR2YmZubXltYmN3dGdocHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTk1MTEsImV4cCI6MjA4MjM5NTUxMX0.k7RvELdK4VZg5ULnxX26EW8YtOrFSnOuUcMEVSw-1o8'
  }
});
console.log('Status:', response.status); // Should be 200
```

### Check If Tables Exist
In Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';
```

Should return 1 row.

---

## 📋 Summary

**What You Need to Do RIGHT NOW**:

1. ✅ Run the SQL setup in Supabase SQL Editor
2. ✅ Disable email confirmation
3. ✅ Clear browser cache/cookies
4. ✅ Restart dev server
5. ✅ Try registering with proper email format

**After Setup**:
- Registration should work
- Login should work
- Cross-device access should work
- No more errors!

---

## 🆘 Still Having Issues?

1. **Check Supabase Dashboard** → **Logs** to see detailed errors
2. **Check Browser Console** for specific error messages
3. **Verify `.env` file** has correct credentials
4. **Make sure database tables exist** in Table Editor

---

## ✅ Success Indicators

You'll know it's working when:
1. ✅ No red errors in browser console
2. ✅ Registration redirects to dashboard
3. ✅ Can see user in Supabase **Authentication** → **Users**
4. ✅ Can see profile in **Table Editor** → **user_profiles**
5. ✅ Can login from different browser

**Good luck! 🚀**
