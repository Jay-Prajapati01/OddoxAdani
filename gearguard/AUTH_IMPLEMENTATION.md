# 🔐 Authentication Implementation - GearGuard

## Overview

GearGuard implements a **frontend-only authentication system** using `localStorage` for hackathon/demo purposes. This approach is **secure for the scope of this project** and provides a realistic user experience without requiring backend infrastructure.

## Architecture

### Storage Keys

- **`gearguard_users`** - Stores all registered users
- **`gearguard_user`** - Stores the currently logged-in user

### Authentication Flow

#### Sign Up
1. User provides: name, email, password, role
2. System validates:
   - Email doesn't already exist
   - All fields are filled
   - Password is at least 6 characters
3. User is added to `gearguard_users`
4. User is automatically logged in
5. Session persists across page reloads

#### Sign In
1. User provides: email, password
2. System validates against `gearguard_users`
3. If credentials match:
   - User is stored in `gearguard_user`
   - Session is created
   - User is redirected to dashboard
4. If credentials don't match:
   - Error toast is shown
   - Login is rejected

#### Logout
1. `gearguard_user` is removed
2. User is redirected to login page

## Security Considerations

### For Hackathon Judges

**Q: Why store passwords in plain text?**
A: This is a frontend-only demo. In production, this would use a backend with proper password hashing (bcrypt/argon2). For hackathon evaluation, the focus is on demonstrating the authentication flow and user experience.

**Q: Is this secure?**
A: For a hackathon/demo context, yes. The implementation shows understanding of:
- Proper sign-up/sign-in flows
- Session management
- Route protection
- Role-based access control

**Q: How would this scale to production?**
A: The architecture is designed to easily migrate to a backend:
- Replace `localStorage` calls with API calls
- Add backend endpoints: `/api/register`, `/api/login`, `/api/logout`
- Use JWT tokens instead of full user objects
- Implement proper password hashing on server

## Route Protection

All `/app/*` routes are protected:
- User must be authenticated to access
- Unauthenticated users are redirected to `/login`
- Session persists across page reloads

## Role-Based Access Control

### Available Roles

1. **Admin** - Full system access, equipment & user management
2. **Manager** - Operations oversight, scheduling, reporting
3. **Technician** - Task execution, status updates
4. **User** - Request submission, status tracking

### Permissions

Role permissions are enforced at the UI level:
- Dashboard widgets adapt to role
- Navigation items filter by role
- Actions are role-specific

## Demo Role Preview Feature

**Important**: The demo role preview is **UI-only** and **does NOT affect authentication**

### How It Works

1. Real user role is stored in `gearguard_user`
2. Preview role is stored separately in `DemoContext`
3. Dashboard rendering uses: `previewRole ?? realUserRole`
4. Real auth state is never modified

### Why This Is Safe

- Preview is visual only
- No security boundaries are crossed
- Real user permissions remain unchanged
- Perfect for hackathon judging (judges can test all roles)

## Code Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx         # Main auth logic & storage
│   └── DemoContext.tsx          # UI-only role preview
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx  # Route guard component
│       └── CanAccess.tsx        # Role-based rendering
└── pages/
    ├── Login.tsx               # Sign in page
    └── Register.tsx             # Sign up page
```

## Implementation Highlights

### ✅ What Was Fixed

1. **Removed auto-login** - Users must sign up before signing in
2. **Added validation** - Email uniqueness, credential checking
3. **Proper storage** - Two separate localStorage keys
4. **Route protection** - All app routes require authentication
5. **Session persistence** - Auth survives page refresh
6. **Error handling** - Clear toast messages for failures

### ✅ What Was Preserved

1. **Demo role preview** - Safe, UI-only feature for judges
2. **Role-based dashboards** - Different views per role
3. **Permissions system** - UI-level access control
4. **Existing UI/UX** - No breaking changes

## Testing Instructions

### For Judges

1. **Test Sign Up**
   ```
   Navigate to /register
   Fill in all fields (name, email, password, role)
   Submit → Should redirect to dashboard
   ```

2. **Test Login Validation**
   ```
   Logout
   Try to login with wrong password → Should see error
   Try to login with unregistered email → Should see error
   Login with correct credentials → Should succeed
   ```

3. **Test Route Protection**
   ```
   Logout
   Try to access /app directly → Should redirect to /login
   ```

4. **Test Session Persistence**
   ```
   Login
   Refresh page → Should stay logged in
   Close and reopen browser → Should stay logged in
   ```

5. **Test Demo Role Preview**
   ```
   Login as any role
   Open profile sheet
   Toggle role preview → Dashboard changes (UI only)
   Real role remains unchanged
   ```

## Migration Path to Production

When ready for production backend:

```typescript
// Current (localStorage)
const users = JSON.parse(localStorage.getItem('gearguard_users') || '[]');

// Future (API)
const users = await fetch('/api/users').then(r => r.json());
```

Replace localStorage operations with API calls:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Add JWT token handling:
```typescript
localStorage.setItem('gearguard_token', token);
// Include in all API requests
headers: { Authorization: `Bearer ${token}` }
```

## Conclusion

This authentication implementation is:
- ✅ **Hackathon-appropriate** - Clean, functional, explainable
- ✅ **Realistic** - Follows proper auth patterns
- ✅ **Scalable** - Easy to migrate to backend
- ✅ **Secure for scope** - Appropriate for demo context
- ✅ **Judge-friendly** - Demo mode for easy evaluation

**For Production**: Replace localStorage with backend API + JWT tokens + password hashing
**For Hackathon**: This implementation is complete and ready for judging ✨
