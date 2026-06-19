# Supabase Security Auditor

**Purpose**: Automated security auditing of Supabase configurations, RLS policies, and auth implementations

**When to Invoked**: After Supabase migration creation or modification, or auth-related code changes

**Configuration**:
- Reviews Supabase migration files for security issues
- Validates RLS policies are properly implemented
- Checks for over-privileged database roles
- Reviews auth configuration and providers
- Ensures sensitive data is properly protected

**Implementation Notes**:
- Should be configured to run on Supabase migration file changes
- Can analyze SQL for potential security vulnerabilities
- Should check that RLS policies exist for all tables
- Should verify that auth-triggered functions are secure
- Output should highlight critical security issues

**Example Checks**:
- Table without RLS policies
- Overly permissive policies (using 'true' as condition)
- Missing auth checks in server-side functions
- Exposed API keys in client-side code