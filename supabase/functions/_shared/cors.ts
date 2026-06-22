// APP_URL must be set in production. An empty string disallows all origins,
// which is safer than a wildcard "*" fallback.
const allowedOrigin = Deno.env.get("APP_URL") ?? ""

export const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}
