const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

const missing = []
if (!url || url === "your_supabase_url_here") missing.push("VITE_SUPABASE_URL")
if (!anonKey || anonKey === "your_supabase_anon_key_here") missing.push("VITE_SUPABASE_ANON_KEY")

if (missing.length > 0) {
  console.warn(`Skipping Supabase smoke check. Missing: ${missing.join(", ")}`)
  process.exit(0)
}

try {
  new URL(url)
} catch {
  console.error("VITE_SUPABASE_URL is not a valid URL")
  process.exit(1)
}

const response = await fetch(`${url}/auth/v1/settings`, {
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  },
})

if (!response.ok) {
  console.error(`Supabase smoke check failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

console.log("Supabase smoke check passed")
