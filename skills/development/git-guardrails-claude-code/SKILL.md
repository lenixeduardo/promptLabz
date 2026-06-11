---
name: git-guardrails-claude-code
description: Sets up hooks that block dangerous Git commands (push, reset --hard, clean) before execution.
author: mattpocock
category: development
source: https://github.com/mattpocock/skills
---

# Git Guardrails

Protective Git hooks that:
- Block dangerous commands (`push`, `reset --hard`, `clean -fd`)
- Require confirmation before destructive operations
- Prevent force-pushing to protected branches
- Warn before committing to main/master
- Ensure code review before merge
- Log safety violations for audit
