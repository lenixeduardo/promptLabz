## CLAUDE.md Quality Report

### Summary
- Files found: 1
- Average score: 40/100
- Files needing update: 1

### File-by-File Assessment

#### 1. ./CLAUDE.md (Project Root)
**Score: 40/100 (Grade: D)**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Commands/workflows | 5/20 | Missing specific project commands (dev, build, test, etc.) |
| Architecture clarity | 5/20 | No description of codebase architecture |
| Non-obvious patterns | 5/15 | No project-specific patterns or gotchas documented |
| Conciseness | 10/15 | Verbose generic checklist, could be more concise and targeted |
| Currency | 5/15 | Generic template doesn't reflect current codebase state |
| Actionability | 10/15 | Actionable checklists but not specific to Claude Code workflow |

**Issues:**
- Missing project-specific development commands (dev, build, test, lint)
- No architecture overview of the React/Supabase stack
- Missing non-obvious patterns like offline-first implementation, Context API usage, RLS patterns
- Generic content not tailored to this specific codebase
- Missing environment setup instructions for Supabase
- Missing testing workflow details

**Recommended additions:**
- Development commands from package.json (dev, build, test, lint, etc.)
- Architecture overview showing React SPA with Supabase backend
- Non-obvious patterns: offline-first with localStorage, Context API usage, RLS implementation
- Environment setup: Supabase configuration steps
- Testing workflow: Vitest unit tests, Playwright E2E tests
- Gotchas: Need to configure Supabase for full functionality, offline-first behavior details