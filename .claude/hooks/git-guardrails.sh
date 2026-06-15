#!/bin/bash
set -euo pipefail

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ "$TOOL_NAME" != "Bash" ] || [ -z "$COMMAND" ]; then
  exit 0
fi

block() {
  local reason="$1"
  # Escape any double quotes in the reason for safe JSON output
  reason="${reason//\"/\\\"}"
  printf '{"decision":"block","reason":"%s"}\n' "$reason"
  exit 0
}

# Block force push (--force/-f), but allow the safer --force-with-lease
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*(-f\b|--force\b)' && \
   ! echo "$COMMAND" | grep -q '\-\-force-with-lease'; then
  block "Force push blocked by git guardrails. Confirm explicitly with the user before force-pushing."
fi

# Block reset --hard
if echo "$COMMAND" | grep -qE 'git\s+reset\s+--hard'; then
  block "git reset --hard blocked by git guardrails. This permanently discards local changes — confirm with the user first."
fi

# Block git clean -f / -fd / -fx
if echo "$COMMAND" | grep -qE 'git\s+clean\s+.*-[a-z]*f'; then
  block "git clean -f blocked by git guardrails. This permanently deletes untracked files — confirm with the user first."
fi

# Block direct push to main/master
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*\s(main|master)(\s|$)'; then
  block "Pushing directly to main/master is blocked. Use a feature branch and open a pull request instead."
fi

# Block direct commits/merges on main/master
if echo "$COMMAND" | grep -qE 'git\s+(commit|merge)\b'; then
  BRANCH=$(git -C "${CLAUDE_PROJECT_DIR:-.}" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    block "Direct commits to $BRANCH are blocked by git guardrails. Create a feature branch first."
  fi
fi

exit 0
