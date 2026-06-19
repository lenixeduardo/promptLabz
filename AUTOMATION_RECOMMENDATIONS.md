## Claude Code Automation Recommendations

I've analyzed your codebase and identified the top automations for each category. Here are my top 1-2 recommendations per type:

### Codebase Profile
- **Type**: TypeScript React application
- **Framework**: React 18 with Vite
- **Key Libraries**: Supabase, React Query, Radix UI, Vitest, Playwright, ESLint, TypeScript

---

### 🔌 MCP Servers

#### context7
**Why**: Uses popular libraries like React, Supabase, Radix UI, and Vitest that benefit from live documentation lookup during development
**Install**: `claude mcp add context7`

#### Playwright
**Why**: Already has Playwright E2E tests configured (`pnpm test:e2e`), making browser automation MCP valuable for test generation and debugging
**Install**: `claude mcp add playwright`

---

### 🎯 Skills

#### new-component
**Why**: Extensive use of Radix UI components and consistent UI patterns suggest value in a skill for generating new UI components with proper structure
**Create**: `.claude/skills/new-component/SKILL.md`
**Invocation**: Both
```yaml
---
name: new-component
description: Generate a new React component with Radix UI primitives and proper TypeScript types
disable-model-invocation: false
---
```

#### supabase-migration
**Why**: Uses Supabase with migrations, and a skill for generating and validating Supabase migrations would be valuable
**Create**: `.claude/skills/supabase-migration/SKILL.md`
**Invocation**: User-only (since it involves database changes)
**Also available in**: Could be part of a custom plugin
```yaml
---
name: supabase-migration
description: Generate Supabase migration scripts with validation and testing
disable-model-invocation: true
---
```

---

### ⚡ Hooks

#### auto-format-on-save
**Why**: Uses Prettier (implied by ESLint setup) and consistent code formatting is important for team projects
**Where**: `.claude/settings.json`
**Configuration**:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_TOOL_FILE_PATH",
            "description": "Format file with Prettier after edit",
            "matcher": "Edit|Write",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

#### run-related-tests
**Why**: Has test files alongside source files (.test.tsx), and running related tests after edits provides immediate feedback
**Where**: `.claude/settings.json`
**Configuration**:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "pnpm test --${CLAUDE_TOOL_FILE_PATH\\.test\\.(tsx?$|ts$)}",
            "description": "Run related tests after file edit",
            "matcher": "Edit|Write",
            "timeout": 15000
          }
        ]
      }
    ]
  }
}
```

---

### 🤖 Subagents

#### ui-accessibility-reviewer
**Why**: Uses Radix UI (accessibility-focused) but could benefit from automated accessibility audit of components
**Where**: `.claude/agents/ui-accessibility-reviewer.md`
**Template**: Would run axe-core or similar accessibility testing tools on UI components

#### supabase-security-auditor
**Why**: Uses Supabase with RLS and authentication, making security audits of database policies and auth flows valuable
**Where**: `.claude/agents/supabase-security-auditor.md`
**Template**: Would review Supabase configurations, RLS policies, and auth implementations

---

**Want more?** Ask for additional recommendations for any specific category (e.g., "show me more MCP server options" or "what other hooks would help?").

**Want help implementing any of these?** Just ask and I can help you set up any of the recommendations above.