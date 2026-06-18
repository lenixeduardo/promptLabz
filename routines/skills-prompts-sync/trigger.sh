#!/usr/bin/env bash
# Manual trigger for the skills-prompts-sync Edge Function.
# Usage: SUPABASE_URL=... SKILLS_SYNC_SECRET=... ./routines/skills-prompts-sync/trigger.sh

set -euo pipefail

: "${SUPABASE_URL:?Set SUPABASE_URL to your Supabase project URL}"
: "${SKILLS_SYNC_SECRET:?Set SKILLS_SYNC_SECRET to the function secret}"

FUNCTION_URL="${SUPABASE_URL%/}/functions/v1/skills-prompts-sync"

echo "→ Calling $FUNCTION_URL"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer ${SKILLS_SYNC_SECRET}" \
  -H "Content-Type: application/json" \
  --max-time 120 \
  "$FUNCTION_URL")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "← HTTP $HTTP_CODE"
echo "$BODY" | (command -v jq &>/dev/null && jq . || cat)

if [ "$HTTP_CODE" != "200" ]; then
  echo "Error: expected 200, got $HTTP_CODE" >&2
  exit 1
fi

echo ""
echo "→ Generating Obsidian vault…"
node "$(dirname "$0")/generate-vault.mjs" || true
