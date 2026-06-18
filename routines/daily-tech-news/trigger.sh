#!/usr/bin/env bash
# Manual trigger for the daily-tech-news Edge Function.
# Usage: SUPABASE_URL=... DAILY_NEWS_SECRET=... ./routines/daily-tech-news/trigger.sh

set -euo pipefail

: "${SUPABASE_URL:?Set SUPABASE_URL to your Supabase project URL}"
: "${DAILY_NEWS_SECRET:?Set DAILY_NEWS_SECRET to the function secret}"

FUNCTION_URL="${SUPABASE_URL%/}/functions/v1/daily-tech-news"

echo "→ Calling $FUNCTION_URL"

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Authorization: Bearer ${DAILY_NEWS_SECRET}" \
  -H "Content-Type: application/json" \
  "$FUNCTION_URL")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo "← HTTP $HTTP_CODE"
echo "$BODY" | (command -v jq &>/dev/null && jq . || cat)

if [ "$HTTP_CODE" != "200" ]; then
  echo "Error: expected 200, got $HTTP_CODE" >&2
  exit 1
fi
