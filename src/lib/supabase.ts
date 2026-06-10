import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
const isTest = import.meta.env.MODE === "test"

if (!isTest && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    "Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
  )
}

export const supabase = createClient(
  supabaseUrl || "https://test-only.supabase.co",
  supabaseAnonKey || "test-only-anon-key"
)
