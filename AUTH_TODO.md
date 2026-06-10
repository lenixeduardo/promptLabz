# Authentication Implementation Roadmap - PromptLab

## ✅ COMPLETED (Phase 1 - Login)

- [x] Firebase replaced with Supabase SDK
- [x] AuthContext created for global state
- [x] useAuth hook with login/signup/logout/resetPassword/loginWithGoogle
- [x] PrivateRoute component for route protection
- [x] Login screen integrated with email/password authentication
- [x] Signup screen with form validation
- [x] ForgotPassword screen with email reset
- [x] Error handling and loading states
- [x] tsconfig updated for import.meta.env

---

## 🔧 NEXT STEPS

### Phase 2: Setup & Initial Test (REQUIRED FIRST)
- [ ] Create Supabase project at https://supabase.com
- [ ] Copy credentials to `.env.local`:
  ```
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_ANON_KEY=your_key
  ```
- [ ] Enable Email/Password auth in Supabase Auth settings
- [ ] Enable Google OAuth in Supabase (add OAuth credentials)
- [ ] Test login/signup flow in dev environment
- [ ] Test navigation to /home after successful login

---

### Phase 3: Signup Validation
- [ ] Validate email format (Zod schema)
- [ ] Check email not already registered
- [ ] Validate password strength (8+ chars, uppercase, number)
- [ ] Confirm passwords match
- [ ] Send verification email after signup
- [ ] Create user profile in `users` table after signup
- [ ] Handle duplicate email error gracefully
- [ ] Test full signup → email verification → login flow

---

### Phase 4: ForgotPassword Complete
- [ ] Test password reset email sending
- [ ] Create password reset page (/reset-password?token=...)
- [ ] Validate reset token
- [ ] Update password with token
- [ ] Show success/error messages
- [ ] Redirect to login after password reset

---

### Phase 5: Social Login (Google & Apple)
- [ ] Setup Google OAuth in Supabase
  - Go to Supabase > Authentication > Providers
  - Add Google Client ID & Secret
  - Set redirect URL: `https://yourproject.supabase.co/auth/v1/callback`
- [ ] Setup Apple Sign-In in Supabase
- [ ] Test Google login flow
- [ ] Test Apple login flow
- [ ] Auto-create user profile on social signup
- [ ] Link social account to existing email account (optional)

---

### Phase 6: User Profile & Avatar
- [ ] Create `users` table schema:
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```
- [ ] Store user profile after signup
- [ ] Display user name in Home page header
- [ ] Display avatar in header
- [ ] Edit profile page (/profile)
- [ ] Upload avatar image to Supabase Storage

---

### Phase 7: Session Management
- [ ] Persist auth token in localStorage
- [ ] Auto-logout on token expiration
- [ ] Refresh token on app load
- [ ] Handle expired session on protected routes
- [ ] Logout button in Home/dashboard header
- [ ] Show loading state on app startup

---

### Phase 8: Protected Routes & Navigation
- [ ] Block unauthenticated users from /home, /learn, /lesson, /skills, /mission
- [ ] Redirect anon users to /login
- [ ] Redirect authenticated users from /login → /home
- [ ] Redirect authenticated users from /signup → /home
- [ ] Keep authenticated user on /forgot-password (no redirect)
- [ ] Add logout button to Home header

---

### Phase 9: Email Verification & Confirmations
- [ ] Send verification email after signup
- [ ] Create email verification page (/verify-email)
- [ ] Mark email as verified in users table
- [ ] Prevent login until email verified (optional)
- [ ] Resend verification email button
- [ ] Delete unverified accounts after 7 days (optional)

---

### Phase 10: Error Handling & UX
- [ ] Handle network errors gracefully
- [ ] Show meaningful error messages:
  - "Email already registered"
  - "Invalid email or password"
  - "Password reset link expired"
  - "Please verify your email"
- [ ] Add toast notifications for success (sonner is already installed)
- [ ] Debounce form submissions
- [ ] Show password strength indicator during signup
- [ ] Password visibility toggle in input

---

### Phase 11: Security
- [ ] Enable RLS (Row Level Security) on users table
- [ ] Set up security policies for user data access
- [ ] Validate all inputs server-side (Supabase functions)
- [ ] Hash sensitive data
- [ ] Rate limit login attempts
- [ ] Add CSRF protection
- [ ] Use HTTPS only in production
- [ ] Set secure cookies (if using sessions)

---

### Phase 12: Testing
- [ ] Unit tests for useAuth hook
- [ ] Integration tests for login/signup/logout
- [ ] E2E tests with Playwright:
  - Login flow
  - Signup flow
  - Password reset flow
  - Protected route access
  - Social login flow
- [ ] Test error scenarios
- [ ] Test on different devices/browsers

---

### Phase 13: Polish & Production
- [ ] Remove console.logs
- [ ] Optimize bundle size (currently 561kb)
- [ ] Add loading skeletons
- [ ] Add animations for auth state changes
- [ ] Create onboarding flow after signup
- [ ] Dark mode support for auth pages
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Add analytics tracking
- [ ] Setup error tracking (Sentry)

---

## Quick Start for Development

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Fill .env.local with your Supabase credentials
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# 3. Run dev server
pnpm run dev

# 4. Test login flow:
# - Go to http://localhost:5173/login
# - Create account via /signup
# - Login and navigate to /home
# - Should see protected routes working
```

---

## Files Modified/Created

```
src/
├── contexts/
│   └── AuthContext.tsx          ← NEW: Global auth state
├── hooks/
│   └── useAuth.ts               ← NEW: Auth methods
├── components/
│   └── PrivateRoute.tsx         ← NEW: Protected routes
├── lib/
│   └── supabase.ts              ← NEW: Supabase client
├── pages/
│   ├── Login.tsx                ← MODIFIED: + useAuth integration
│   ├── Signup.tsx               ← MODIFIED: + useAuth integration
│   └── ForgotPassword.tsx       ← MODIFIED: + useAuth integration
├── App.tsx                      ← MODIFIED: + AuthProvider + PrivateRoute
└── main.tsx                     ← Ready for auth context wrapper

.env.example                      ← NEW: Environment template
tsconfig.app.json               ← MODIFIED: + vite/client types
```

---

## Database Schema (to create in Supabase)

```sql
-- Users profile table (extend auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read/update their own profile
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup (via trigger or edge function)
```

---

## Current Status

**Phase 1 Complete** ✅ - Login/Signup/ForgotPassword UI + Supabase integration  
**Phase 2 In Progress** 🔧 - Awaiting Supabase setup and .env.local configuration

Next: Test authentication flow with real Supabase project
