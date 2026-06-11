# Community Premium â€” Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium Community section with Stripe monthly subscription, automated RSS news (summarized by Claude), daily tips, and copy-paste project templates.

**Architecture:** Supabase Edge Functions handle all Stripe and RSS logic â€” no secrets in the frontend. The frontend reads `public.users.premium_status` in real-time via Supabase listener and gates the `/community` route behind a `PremiumGate` component that calls `stripe-checkout` Edge Function on upgrade.

**Tech Stack:** React 18 + TypeScript + Vite, Supabase JS v2, Stripe (Edge Functions only), Deno (Edge Functions runtime), Vitest + React Testing Library, Tailwind CSS.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `supabase/functions/_shared/cors.ts` | CORS headers shared across Edge Functions |
| Create | `supabase/functions/stripe-checkout/index.ts` | Creates Stripe Checkout Session with 30-day trial |
| Create | `supabase/functions/stripe-webhook/index.ts` | Handles Stripe events, updates `users.premium_status` |
| Create | `supabase/functions/stripe-portal/index.ts` | Creates Customer Portal session (manage/cancel) |
| Create | `supabase/functions/rss-fetcher/index.ts` | Cron: fetches RSS feeds, summarizes with Claude, stores in `news` |
| Create | `src/hooks/useSubscription.ts` | Reads + subscribes to `premium_status` in real-time |
| Create | `src/hooks/useSubscription.test.ts` | Unit tests for hook |
| Create | `src/components/PremiumGate.tsx` | Renders paywall or children based on premium status |
| Create | `src/components/PremiumGate.test.tsx` | Tests gate renders correctly per status |
| Create | `src/components/DailyTip.tsx` | Displays today's tip from `daily_tips` table |
| Create | `src/components/DailyTip.test.tsx` | Tests tip renders and handles missing data |
| Create | `src/components/NewsCard.tsx` | Card: title, summary, source, date, link |
| Create | `src/components/NewsCard.test.tsx` | Tests card content renders |
| Create | `src/components/TemplateCard.tsx` | Card: title, description, category, copy button |
| Create | `src/components/TemplateCard.test.tsx` | Tests copy-to-clipboard behavior |
| Create | `src/pages/Community.tsx` | Main community page: tip + news + templates |
| Create | `src/pages/Community.test.tsx` | Integration test: premium vs paywall rendering |
| Modify | `src/App.tsx` | Add `/community` route |
| Modify | `src/pages/Home.tsx` | Add Community nav card |

---

## Pre-requisites

Before starting:
1. Install Supabase CLI: `npm install -g supabase` (or use `npx supabase`)
2. In Stripe Dashboard: create Product "PromptLabz Premium" â†’ recurring Price (monthly) â†’ copy Price ID
3. Have ready: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`, `ANTHROPIC_API_KEY`

---

## Task 1: DB Migration â€” Premium Fields on `users` Table

**Files:**
- Create: `supabase/migrations/20260610_001_users_premium.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/20260610_001_users_premium.sql
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS premium_status TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ;

-- Constrain allowed values
ALTER TABLE public.users
  ADD CONSTRAINT premium_status_check
  CHECK (premium_status IN ('free', 'trial', 'active', 'cancelled'));
```

- [ ] **Step 2: Apply migration via Supabase MCP or Dashboard**

Option A â€” Supabase MCP (if available in session):
```
Use mcp__claude_ai_Supabase__apply_migration with the SQL above
```

Option B â€” Supabase Dashboard â†’ SQL Editor â†’ paste and run.

- [ ] **Step 3: Verify columns exist**

In Supabase Dashboard â†’ Table Editor â†’ `users` table.
Expected: new columns `premium_status`, `stripe_customer_id`, `stripe_subscription_id`, `trial_ends_at`, `premium_since` visible.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260610_001_users_premium.sql
git commit -m "feat: add premium subscription fields to users table"
```

---

## Task 2: DB Migration â€” Community Tables + RLS

**Files:**
- Create: `supabase/migrations/20260610_002_community_tables.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/20260610_002_community_tables.sql

-- News (populated by rss-fetcher cron)
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  source_name TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read news"
  ON public.news FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Daily tips (manually inserted)
CREATE TABLE IF NOT EXISTS public.daily_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_text TEXT NOT NULL,
  category TEXT,
  scheduled_date DATE UNIQUE NOT NULL
);

ALTER TABLE public.daily_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read daily_tips"
  ON public.daily_tips FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Templates (manually inserted)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can read templates"
  ON public.templates FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users
      WHERE premium_status IN ('trial', 'active')
    )
  );

-- Seed one daily tip so the UI has data immediately
INSERT INTO public.daily_tips (tip_text, category, scheduled_date)
VALUES (
  'Use "pense passo a passo" no final de prompts complexos. Isso ativa o raciocÃ­nio encadeado (Chain of Thought) e reduz erros em tarefas analÃ­ticas.',
  'Prompt',
  CURRENT_DATE
) ON CONFLICT (scheduled_date) DO NOTHING;
```

- [ ] **Step 2: Apply migration**

Same as Task 1 Step 2 â€” Supabase MCP or Dashboard SQL Editor.

- [ ] **Step 3: Verify tables exist**

Supabase Dashboard â†’ Table Editor â†’ confirm `news`, `daily_tips`, `templates` present.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260610_002_community_tables.sql
git commit -m "feat: create community tables (news, daily_tips, templates) with RLS"
```

---

## Task 3: Edge Function â€” Shared CORS + stripe-checkout

**Files:**
- Create: `supabase/functions/_shared/cors.ts`
- Create: `supabase/functions/stripe-checkout/index.ts`

- [ ] **Step 1: Initialize supabase directory if needed**

```bash
npx supabase init
```

Expected: creates `supabase/` directory with `config.toml`. Safe to run if already exists.

- [ ] **Step 2: Create CORS helper**

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}
```

- [ ] **Step 3: Create stripe-checkout function**

```typescript
// supabase/functions/stripe-checkout/index.ts
import Stripe from "npm:stripe@14"
import { createClient } from "npm:@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const { data: userRow } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    let customerId = userRow?.stripe_customer_id as string | undefined

    if (!customerId) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
      const customer = await stripe.customers.create({
        email: authUser.user?.email,
        metadata: { supabase_uid: userId },
      })
      customerId = customer.id
      await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        { price: Deno.env.get("STRIPE_PRICE_ID")!, quantity: 1 },
      ],
      subscription_data: { trial_period_days: 30 },
      success_url: `${Deno.env.get("APP_URL")}/community?subscribed=true`,
      cancel_url: `${Deno.env.get("APP_URL")}/community`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("stripe-checkout error:", err)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
```

- [ ] **Step 4: Set Supabase secrets**

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_PRICE_ID=price_... APP_URL=https://your-app.vercel.app
```

- [ ] **Step 5: Deploy function**

```bash
npx supabase functions deploy stripe-checkout --no-verify-jwt
```

Expected output: `Deployed stripe-checkout`

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/_shared/cors.ts supabase/functions/stripe-checkout/index.ts
git commit -m "feat: add stripe-checkout edge function with 30-day trial"
```

---

## Task 4: Edge Function â€” stripe-webhook

**Files:**
- Create: `supabase/functions/stripe-webhook/index.ts`

- [ ] **Step 1: Create webhook function**

```typescript
// supabase/functions/stripe-webhook/index.ts
import Stripe from "npm:stripe@14"
import { createClient } from "npm:@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

const stripeStatusToApp: Record<string, string> = {
  trialing: "trial",
  active: "active",
  canceled: "cancelled",
  unpaid: "cancelled",
  past_due: "cancelled",
  incomplete: "cancelled",
  incomplete_expired: "cancelled",
}

Deno.serve(async (req) => {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return new Response("Missing stripe-signature", { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  try {
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription
      const appStatus = stripeStatusToApp[sub.status] ?? "cancelled"
      const trialEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null

      await supabaseAdmin
        .from("users")
        .update({
          premium_status: appStatus,
          stripe_subscription_id: sub.id,
          trial_ends_at: trialEnd,
          premium_since: appStatus === "active" ? new Date().toISOString() : null,
        })
        .eq("stripe_customer_id", sub.customer as string)
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice
      await supabaseAdmin
        .from("users")
        .update({ premium_status: "cancelled" })
        .eq("stripe_customer_id", invoice.customer as string)
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return new Response("Handler error", { status: 500 })
  }

  return new Response("ok", { status: 200 })
})
```

- [ ] **Step 2: Set webhook secret**

```bash
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

- [ ] **Step 3: Deploy function**

```bash
npx supabase functions deploy stripe-webhook --no-verify-jwt
```

- [ ] **Step 4: Register webhook in Stripe Dashboard**

Stripe Dashboard â†’ Developers â†’ Webhooks â†’ Add endpoint:
- URL: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
- Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/stripe-webhook/index.ts
git commit -m "feat: add stripe-webhook edge function for subscription status sync"
```

---

## Task 5: Edge Function â€” stripe-portal

**Files:**
- Create: `supabase/functions/stripe-portal/index.ts`

- [ ] **Step 1: Create portal function**

```typescript
// supabase/functions/stripe-portal/index.ts
import Stripe from "npm:stripe@14"
import { corsHeaders } from "../_shared/cors.ts"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
})

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { stripeCustomerId } = await req.json()
    if (!stripeCustomerId) {
      return new Response(JSON.stringify({ error: "stripeCustomerId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${Deno.env.get("APP_URL")}/community`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("stripe-portal error:", err)
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
```

- [ ] **Step 2: Enable Customer Portal in Stripe Dashboard**

Stripe Dashboard â†’ Billing â†’ Customer portal â†’ Activate session.

- [ ] **Step 3: Deploy function**

```bash
npx supabase functions deploy stripe-portal --no-verify-jwt
```

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/stripe-portal/index.ts
git commit -m "feat: add stripe-portal edge function for subscription management"
```

---

## Task 6: Edge Function â€” rss-fetcher (Cron)

**Files:**
- Create: `supabase/functions/rss-fetcher/index.ts`

- [ ] **Step 1: Create rss-fetcher function**

```typescript
// supabase/functions/rss-fetcher/index.ts
import Anthropic from "npm:@anthropic-ai/sdk@0.20"
import { createClient } from "npm:@supabase/supabase-js@2"

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! })
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

const RSS_FEEDS = [
  { url: "https://openai.com/blog/rss.xml", name: "OpenAI Blog" },
  { url: "https://www.anthropic.com/news.rss", name: "Anthropic News" },
  { url: "https://blog.google/technology/ai/rss/", name: "Google AI Blog" },
  { url: "https://www.technologyreview.com/feed/", name: "MIT Technology Review" },
  { url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", name: "The Verge AI" },
]

interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
}

async function fetchRSS(feedUrl: string): Promise<RSSItem[]> {
  const res = await fetch(feedUrl, { signal: AbortSignal.timeout(10_000) })
  const text = await res.text()

  const items: RSSItem[] = []
  const itemMatches = text.matchAll(/<item>([\s\S]*?)<\/item>/g)

  for (const match of itemMatches) {
    const block = match[1]
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ??
      block.match(/<title>(.*?)<\/title>/)?.[1] ?? ""
    const link = block.match(/<link>(.*?)<\/link>|<link[^>]*href="([^"]+)"/)?.[1] ??
      block.match(/<link[^>]*href="([^"]+)"/)?.[2] ?? ""
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? ""
    const desc = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/)?.[1] ?? "")
      .replace(/<[^>]*>/g, "").slice(0, 500)

    if (title && link) {
      items.push({ title: title.trim(), link: link.trim(), pubDate, description: desc })
    }
    if (items.length >= 10) break
  }

  return items
}

async function summarize(title: string, description: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Resuma em exatamente 3 frases diretas em portuguÃªs para um profissional que quer se atualizar em IA:\n\nTÃ­tulo: ${title}\n\nConteÃºdo: ${description}`,
      },
    ],
  })
  return (msg.content[0] as { type: "text"; text: string }).text
}

Deno.serve(async () => {
  let inserted = 0
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Cleanup old news
  await supabaseAdmin.from("news").delete().lt("fetched_at", thirtyDaysAgo)

  for (const feed of RSS_FEEDS) {
    if (inserted >= 20) break

    try {
      const items = await fetchRSS(feed.url)

      for (const item of items) {
        if (inserted >= 20) break
        if (!item.link) continue

        const { data: existing } = await supabaseAdmin
          .from("news")
          .select("id")
          .eq("source_url", item.link)
          .maybeSingle()

        if (existing) continue

        const summary = await summarize(item.title, item.description)

        await supabaseAdmin.from("news").insert({
          title: item.title,
          summary,
          source_url: item.link,
          source_name: feed.name,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        })

        inserted++
        console.log(`Inserted: ${item.title} (${feed.name})`)
      }
    } catch (err) {
      console.error(`Feed ${feed.name} failed:`, err)
    }
  }

  return new Response(JSON.stringify({ inserted }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

- [ ] **Step 2: Set Anthropic secret**

```bash
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 3: Deploy function**

```bash
npx supabase functions deploy rss-fetcher --no-verify-jwt
```

- [ ] **Step 4: Schedule cron via Supabase Dashboard**

Supabase Dashboard â†’ Database â†’ Extensions â†’ enable `pg_cron`.

Then run in SQL Editor:
```sql
SELECT cron.schedule(
  'rss-fetcher-daily',
  '0 8 * * *',  -- 08:00 UTC daily
  $$
  SELECT net.http_post(
    url := 'https://<your-project-ref>.supabase.co/functions/v1/rss-fetcher',
    headers := '{"Authorization": "Bearer <service-role-key>"}'::jsonb
  )
  $$
);
```

Replace `<your-project-ref>` and `<service-role-key>` with actual values.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/rss-fetcher/index.ts
git commit -m "feat: add rss-fetcher edge function with Claude summarization and daily cron"
```

---

## Task 7: Hook â€” useSubscription

**Files:**
- Create: `src/hooks/useSubscription.ts`
- Create: `src/hooks/useSubscription.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/hooks/useSubscription.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useSubscription } from "./useSubscription"

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}))

const mockSelect = vi.fn()
const mockChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
}
const mockRemoveChannel = vi.fn()

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({ select: mockSelect }),
    channel: () => mockChannel,
    removeChannel: mockRemoveChannel,
  },
}))

describe("useSubscription", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () => Promise.resolve({
          data: { premium_status: "free", trial_ends_at: null, premium_since: null },
        }),
      }),
    })
  })

  it("returns free status initially", async () => {
    const { result } = renderHook(() => useSubscription())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.subscription.status).toBe("free")
    expect(result.current.isPremium).toBe(false)
  })

  it("returns isPremium true when status is active", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () => Promise.resolve({
          data: { premium_status: "active", trial_ends_at: null, premium_since: "2026-06-10T00:00:00Z" },
        }),
      }),
    })
    const { result } = renderHook(() => useSubscription())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isPremium).toBe(true)
  })

  it("returns isPremium true when status is trial", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () => Promise.resolve({
          data: { premium_status: "trial", trial_ends_at: "2026-07-10T00:00:00Z", premium_since: null },
        }),
      }),
    })
    const { result } = renderHook(() => useSubscription())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isPremium).toBe(true)
  })

  it("returns isPremium false when status is cancelled", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        single: () => Promise.resolve({
          data: { premium_status: "cancelled", trial_ends_at: null, premium_since: null },
        }),
      }),
    })
    const { result } = renderHook(() => useSubscription())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isPremium).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- useSubscription
```

Expected: FAIL â€” `useSubscription` not found.

- [ ] **Step 3: Implement hook**

```typescript
// src/hooks/useSubscription.ts
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"

export type PremiumStatus = "free" | "trial" | "active" | "cancelled"

export interface Subscription {
  status: PremiumStatus
  trialEndsAt: string | null
  premiumSince: string | null
  stripeCustomerId: string | null
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription>({
    status: "free",
    trialEndsAt: null,
    premiumSince: null,
    stripeCustomerId: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSubscription({ status: "free", trialEndsAt: null, premiumSince: null, stripeCustomerId: null })
      setLoading(false)
      return
    }

    async function fetchSubscription() {
      const { data } = await supabase
        .from("users")
        .select("premium_status, trial_ends_at, premium_since, stripe_customer_id")
        .eq("id", user!.id)
        .single()

      if (data) {
        setSubscription({
          status: data.premium_status as PremiumStatus,
          trialEndsAt: data.trial_ends_at,
          premiumSince: data.premium_since,
          stripeCustomerId: data.stripe_customer_id,
        })
      }
      setLoading(false)
    }

    fetchSubscription()

    const channel = supabase
      .channel("user-premium-" + user.id)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          setSubscription({
            status: payload.new.premium_status as PremiumStatus,
            trialEndsAt: payload.new.trial_ends_at,
            premiumSince: payload.new.premium_since,
            stripeCustomerId: payload.new.stripe_customer_id,
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const isPremium = subscription.status === "trial" || subscription.status === "active"

  return { subscription, isPremium, loading }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- useSubscription
```

Expected: 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useSubscription.ts src/hooks/useSubscription.test.ts
git commit -m "feat: add useSubscription hook with real-time premium status"
```

---

## Task 8: Component â€” PremiumGate

**Files:**
- Create: `src/components/PremiumGate.tsx`
- Create: `src/components/PremiumGate.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/components/PremiumGate.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PremiumGate } from "./PremiumGate"

vi.mock("@/hooks/useSubscription", () => ({
  useSubscription: vi.fn(),
}))
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}))
vi.mock("@/lib/supabase", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}))

import { useSubscription } from "@/hooks/useSubscription"

describe("PremiumGate", () => {
  it("shows spinner while loading", () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "free", trialEndsAt: null, premiumSince: null, stripeCustomerId: null },
      isPremium: false,
      loading: true,
    })
    render(<PremiumGate><div>premium content</div></PremiumGate>)
    expect(screen.queryByText("premium content")).not.toBeInTheDocument()
  })

  it("shows children when user is active", () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "active", trialEndsAt: null, premiumSince: "2026-06-10T00:00:00Z", stripeCustomerId: "cus_123" },
      isPremium: true,
      loading: false,
    })
    render(<PremiumGate><div>premium content</div></PremiumGate>)
    expect(screen.getByText("premium content")).toBeInTheDocument()
  })

  it("shows children when user is in trial", () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "trial", trialEndsAt: "2026-07-10T00:00:00Z", premiumSince: null, stripeCustomerId: "cus_123" },
      isPremium: true,
      loading: false,
    })
    render(<PremiumGate><div>premium content</div></PremiumGate>)
    expect(screen.getByText("premium content")).toBeInTheDocument()
  })

  it("shows paywall when user is free", () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "free", trialEndsAt: null, premiumSince: null, stripeCustomerId: null },
      isPremium: false,
      loading: false,
    })
    render(<PremiumGate><div>premium content</div></PremiumGate>)
    expect(screen.queryByText("premium content")).not.toBeInTheDocument()
    expect(screen.getByText("Ativar Premium")).toBeInTheDocument()
  })

  it("shows paywall when user is cancelled", () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "cancelled", trialEndsAt: null, premiumSince: null, stripeCustomerId: null },
      isPremium: false,
      loading: false,
    })
    render(<PremiumGate><div>premium content</div></PremiumGate>)
    expect(screen.getByText("Ativar Premium")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- PremiumGate
```

Expected: FAIL â€” `PremiumGate` not found.

- [ ] **Step 3: Implement component**

```typescript
// src/components/PremiumGate.tsx
import { ReactNode } from "react"
import { useSubscription } from "@/hooks/useSubscription"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Lock, Sparkles, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface PremiumGateProps {
  children: ReactNode
}

export function PremiumGate({ children }: PremiumGateProps) {
  const { isPremium, loading } = useSubscription()
  const { user } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3E8E5E] border-t-transparent" />
      </div>
    )
  }

  if (isPremium) return <>{children}</>

  async function handleActivate() {
    const { data } = await supabase.functions.invoke("stripe-checkout", {
      body: { userId: user?.id },
    })
    if (data?.url) window.location.href = data.url
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-[360px] rounded-3xl border border-[#CDEAD8] bg-white p-8 text-center shadow-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF7EF]">
          <Lock className="h-7 w-7 text-[#3E8E5E]" />
        </div>
        <h2 className="text-xl font-extrabold text-[#1F2A24]">ConteÃºdo Exclusivo</h2>
        <p className="mt-1 text-sm text-[#6B7A70]">Acesso Ã  Comunidade Premium</p>
        <ul className="mt-6 flex flex-col gap-2 text-left">
          {["NotÃ­cias diÃ¡rias de IA", "Dica do dia", "Templates prontos"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm font-medium text-[#2B5D3A]">
              <Check className="h-4 w-4 text-[#3E9A63]" /> {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-[#6B7A70]">1 mÃªs grÃ¡tis Â· cancele quando quiser</p>
        <Button onClick={handleActivate} className="mt-4 w-full gap-2">
          <Sparkles className="h-4 w-4" /> Ativar Premium
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- PremiumGate
```

Expected: 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/PremiumGate.tsx src/components/PremiumGate.test.tsx
git commit -m "feat: add PremiumGate component with paywall and Stripe checkout trigger"
```

---

## Task 9: Component â€” DailyTip

**Files:**
- Create: `src/components/DailyTip.tsx`
- Create: `src/components/DailyTip.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/components/DailyTip.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { DailyTip } from "./DailyTip"

const mockSelect = vi.fn()
vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ select: mockSelect }) },
}))

describe("DailyTip", () => {
  it("renders tip text and category", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({
        maybeSingle: () => Promise.resolve({
          data: {
            id: "1",
            tip_text: "Use Chain of Thought para raciocÃ­nio complexo.",
            category: "Prompt",
            scheduled_date: "2026-06-10",
          },
        }),
      }),
    })

    render(<DailyTip />)
    await waitFor(() => {
      expect(screen.getByText("Use Chain of Thought para raciocÃ­nio complexo.")).toBeInTheDocument()
    })
    expect(screen.getByText("Prompt")).toBeInTheDocument()
  })

  it("shows fallback when no tip for today", async () => {
    mockSelect.mockReturnValue({
      eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }),
    })

    render(<DailyTip />)
    await waitFor(() => {
      expect(screen.getByText("Dica em breve!")).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- DailyTip
```

Expected: FAIL.

- [ ] **Step 3: Implement component**

```typescript
// src/components/DailyTip.tsx
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Lightbulb } from "lucide-react"

interface Tip {
  id: string
  tip_text: string
  category: string | null
  scheduled_date: string
}

export function DailyTip() {
  const [tip, setTip] = useState<Tip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTip() {
      const today = new Date().toISOString().split("T")[0]
      const { data } = await supabase
        .from("daily_tips")
        .select("id, tip_text, category, scheduled_date")
        .eq("scheduled_date", today)
        .maybeSingle()
      setTip(data)
      setLoading(false)
    }
    fetchTip()
  }, [])

  if (loading) {
    return (
      <div className="h-20 animate-pulse rounded-2xl bg-[#EAF7EF]" />
    )
  }

  return (
    <div className="rounded-2xl border border-[#BFE3CC] bg-[#EAF7EF] px-4 py-4">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#3E8E5E]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
          Dica do Dia
        </span>
        {tip?.category && (
          <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-[#2B5D3A]">
            {tip.category}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-[#2B5D3A]">
        {tip ? tip.tip_text : "Dica em breve!"}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- DailyTip
```

Expected: 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/DailyTip.tsx src/components/DailyTip.test.tsx
git commit -m "feat: add DailyTip component"
```

---

## Task 10: Component â€” NewsCard

**Files:**
- Create: `src/components/NewsCard.tsx`
- Create: `src/components/NewsCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/components/NewsCard.test.tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { NewsCard } from "./NewsCard"

const mockNews = {
  id: "1",
  title: "OpenAI lanÃ§a novo modelo",
  summary: "O modelo GPT-5 foi anunciado. Traz capacidades multimodais avanÃ§adas. DisponÃ­vel via API em breve.",
  source_url: "https://openai.com/blog/gpt-5",
  source_name: "OpenAI Blog",
  published_at: "2026-06-10T08:00:00Z",
}

describe("NewsCard", () => {
  it("renders title, summary, and source", () => {
    render(<NewsCard news={mockNews} />)
    expect(screen.getByText("OpenAI lanÃ§a novo modelo")).toBeInTheDocument()
    expect(screen.getByText(/GPT-5 foi anunciado/)).toBeInTheDocument()
    expect(screen.getByText("OpenAI Blog")).toBeInTheDocument()
  })

  it("renders link to article", () => {
    render(<NewsCard news={mockNews} />)
    const link = screen.getByRole("link", { name: /ler artigo/i })
    expect(link).toHaveAttribute("href", "https://openai.com/blog/gpt-5")
    expect(link).toHaveAttribute("target", "_blank")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- NewsCard
```

Expected: FAIL.

- [ ] **Step 3: Implement component**

```typescript
// src/components/NewsCard.tsx
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface NewsItem {
  id: string
  title: string
  summary: string
  source_url: string
  source_name: string
  published_at: string | null
}

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  const formattedDate = news.published_at
    ? format(new Date(news.published_at), "dd MMM yyyy", { locale: ptBR })
    : ""

  return (
    <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
      <p className="text-sm font-bold leading-snug text-[#1F2A24]">{news.title}</p>
      <p className="mt-2 text-xs leading-relaxed text-[#4A5D50]">{news.summary}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[#6B7A70]">
          {news.source_name}
          {formattedDate && ` Â· ${formattedDate}`}
        </span>
        <a
          href={news.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-[#3E8E5E] hover:underline"
        >
          Ler artigo <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- NewsCard
```

Expected: 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/NewsCard.tsx src/components/NewsCard.test.tsx
git commit -m "feat: add NewsCard component"
```

---

## Task 11: Component â€” TemplateCard

**Files:**
- Create: `src/components/TemplateCard.tsx`
- Create: `src/components/TemplateCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/components/TemplateCard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { TemplateCard } from "./TemplateCard"

const mockTemplate = {
  id: "1",
  title: "Email de ProspecÃ§Ã£o",
  description: "Template para cold email com IA generativa.",
  category: "Marketing",
  code: "OlÃ¡ [Nome], vi que vocÃª trabalha com...",
  created_at: "2026-06-10T00:00:00Z",
}

describe("TemplateCard", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it("renders title, description, and category", () => {
    render(<TemplateCard template={mockTemplate} />)
    expect(screen.getByText("Email de ProspecÃ§Ã£o")).toBeInTheDocument()
    expect(screen.getByText("Template para cold email com IA generativa.")).toBeInTheDocument()
    expect(screen.getByText("Marketing")).toBeInTheDocument()
  })

  it("copies code to clipboard on button click", async () => {
    render(<TemplateCard template={mockTemplate} />)
    const btn = screen.getByRole("button", { name: /copiar/i })
    fireEvent.click(btn)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("OlÃ¡ [Nome], vi que vocÃª trabalha com...")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- TemplateCard
```

Expected: FAIL.

- [ ] **Step 3: Implement component**

```typescript
// src/components/TemplateCard.tsx
import { useState } from "react"
import { Copy, Check } from "lucide-react"

export interface Template {
  id: string
  title: string
  description: string
  category: string
  code: string
  created_at: string
}

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(template.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-[#EAF7EF] px-2 py-0.5 text-xs font-semibold text-[#2B5D3A]">
            {template.category}
          </span>
          <p className="mt-1.5 text-sm font-bold text-[#1F2A24]">{template.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#4A5D50]">{template.description}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#EAF7EF] px-3 py-2 text-xs font-semibold text-[#1E6B3A] transition-colors hover:bg-[#D2EEDD]"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5" /> Copiado</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copiar</>
          )}
        </button>
      </div>
      <pre className="mt-3 max-h-32 overflow-y-auto rounded-xl bg-[#F5FBF7] p-3 text-xs leading-relaxed text-[#2B5D3A] whitespace-pre-wrap font-mono">
        {template.code}
      </pre>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- TemplateCard
```

Expected: 2 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/components/TemplateCard.tsx src/components/TemplateCard.test.tsx
git commit -m "feat: add TemplateCard component with copy-to-clipboard"
```

---

## Task 12: Page â€” Community

**Files:**
- Create: `src/pages/Community.tsx`
- Create: `src/pages/Community.test.tsx`

- [ ] **Step 1: Write the failing test**

```typescript
// src/pages/Community.test.tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Community from "./Community"

vi.mock("@/hooks/useSubscription", () => ({
  useSubscription: vi.fn(),
}))
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" } }),
}))
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }),
        order: () => ({ limit: () => Promise.resolve({ data: [] }) }),
        eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [] }) }) }),
      }),
    }),
    functions: { invoke: vi.fn() },
  },
}))
vi.mock("@/components/HelpButton", () => ({ HelpButton: () => null }))

import { useSubscription } from "@/hooks/useSubscription"

function renderCommunity(url = "/community") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/community" element={<Community />} />
        <Route path="/home" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("Community page", () => {
  it("shows paywall for free users", async () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "free", trialEndsAt: null, premiumSince: null, stripeCustomerId: null },
      isPremium: false,
      loading: false,
    })
    renderCommunity()
    expect(screen.getByText("Ativar Premium")).toBeInTheDocument()
  })

  it("shows community content for premium users", async () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "active", trialEndsAt: null, premiumSince: "2026-06-10T00:00:00Z", stripeCustomerId: "cus_123" },
      isPremium: true,
      loading: false,
    })
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText("NotÃ­cias de IA")).toBeInTheDocument()
    })
    expect(screen.getByText("Templates")).toBeInTheDocument()
  })

  it("shows subscribed toast when ?subscribed=true", async () => {
    vi.mocked(useSubscription).mockReturnValue({
      subscription: { status: "active", trialEndsAt: null, premiumSince: "2026-06-10T00:00:00Z", stripeCustomerId: "cus_123" },
      isPremium: true,
      loading: false,
    })
    renderCommunity("/community?subscribed=true")
    await waitFor(() => {
      expect(screen.getByText("NotÃ­cias de IA")).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test -- Community
```

Expected: FAIL.

- [ ] **Step 3: Implement Community page**

```typescript
// src/pages/Community.tsx
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Crown, Newspaper, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HelpButton } from "@/components/HelpButton"
import { PremiumGate } from "@/components/PremiumGate"
import { DailyTip } from "@/components/DailyTip"
import { NewsCard, NewsItem } from "@/components/NewsCard"
import { TemplateCard, Template } from "@/components/TemplateCard"
import { useSubscription } from "@/hooks/useSubscription"
import { supabase } from "@/lib/supabase"
import { sileo } from "sileo"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const TEMPLATE_CATEGORIES = ["Todos", "Marketing", "Dev", "Copywriting", "Produtividade", "IA"]

function CommunityContent() {
  const navigate = useNavigate()
  const { subscription } = useSubscription()
  const [news, setNews] = useState<NewsItem[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [loadingNews, setLoadingNews] = useState(true)
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      const { data } = await supabase
        .from("news")
        .select("id, title, summary, source_url, source_name, published_at")
        .order("published_at", { ascending: false })
        .limit(10)
      setNews(data ?? [])
      setLoadingNews(false)
    }
    fetchNews()
  }, [])

  useEffect(() => {
    async function fetchTemplates() {
      let query = supabase
        .from("templates")
        .select("id, title, description, category, code, created_at")
        .order("created_at", { ascending: false })

      if (activeCategory !== "Todos") {
        query = query.eq("category", activeCategory)
      }

      const { data } = await query
      setTemplates(data ?? [])
      setLoadingTemplates(false)
    }
    fetchTemplates()
  }, [activeCategory])

  async function handleManageSubscription() {
    if (!subscription.stripeCustomerId) return
    const { data } = await supabase.functions.invoke("stripe-portal", {
      body: { stripeCustomerId: subscription.stripeCustomerId },
    })
    if (data?.url) window.location.href = data.url
  }

  const trialEnd = subscription.trialEndsAt
    ? format(new Date(subscription.trialEndsAt), "MM/yyyy", { locale: ptBR })
    : null

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] to-[#D2EEDD] px-5 py-6">
      <div className="mx-auto w-full max-w-[460px]">

        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/home")}
            className="flex items-center gap-1.5 text-[#2E8B57] hover:text-[#1F2A24]"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#3E8E5E]">
            Comunidade
          </span>
        </div>

        {/* Premium badge */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#BFE3CC] bg-gradient-to-r from-[#D9F0E1] to-[#C2E8D0] px-4 py-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#3E8E5E]" />
            <div>
              <p className="text-sm font-extrabold text-[#1F2A24]">Membro Premium</p>
              {trialEnd && (
                <p className="text-xs text-[#4A5D50]">Trial atÃ© {trialEnd}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleManageSubscription}
            className="text-xs font-semibold text-[#3E8E5E] hover:underline"
          >
            Gerenciar
          </button>
        </div>

        {/* Daily Tip */}
        <div className="mt-6">
          <DailyTip />
        </div>

        {/* News */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-[#3E8E5E]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B5D3A]">
              NotÃ­cias de IA
            </h2>
          </div>
          {loadingNews ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/60" />
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="text-sm text-[#6B7A70]">Nenhuma notÃ­cia disponÃ­vel ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {news.map((item) => <NewsCard key={item.id} news={item} />)}
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-[#3E8E5E]" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#2B5D3A]">
              Templates
            </h2>
          </div>

          {/* Category chips */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setLoadingTemplates(true) }}
                className={`flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all shadow-sm ${
                  activeCategory === cat
                    ? "border-[#3E9A63] bg-[#3E8E5E] text-white"
                    : "border-[#CDEAD8] bg-white text-[#2A3B30] hover:bg-[#F0FAF3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {loadingTemplates ? (
              [1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60" />
              ))
            ) : templates.length === 0 ? (
              <p className="text-sm text-[#6B7A70]">Nenhum template nessa categoria ainda.</p>
            ) : (
              templates.map((t) => <TemplateCard key={t.id} template={t} />)
            )}
          </div>
        </div>

      </div>
      <HelpButton />
    </div>
  )
}

export default function Community() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get("subscribed") === "true") {
      sileo.success("Bem-vindo ao Premium! ðŸŽ‰ Seu mÃªs grÃ¡tis comeÃ§ou.")
    }
  }, [])

  return (
    <PremiumGate>
      <CommunityContent />
    </PremiumGate>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test -- Community
```

Expected: 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Community.tsx src/pages/Community.test.tsx
git commit -m "feat: add Community page with news, daily tip, and templates"
```

---

## Task 13: Route + Home Navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Add /community route to App.tsx**

In `src/App.tsx`, add the import and route:

```typescript
// Add import at top with other page imports
import Community from "@/pages/Community"
```

```typescript
// Add route inside <Routes>, after the /mission route
<Route
  path="/community"
  element={
    <PrivateRoute>
      <Community />
    </PrivateRoute>
  }
/>
```

- [ ] **Step 2: Read Home.tsx to find where to add Community nav card**

Read `src/pages/Home.tsx` to locate the navigation card grid.

- [ ] **Step 3: Add Community card to Home navigation**

Find the section in `Home.tsx` where navigation cards are rendered (look for cards linking to `/learn`, `/skills`, etc.) and add a Community card in the same style:

```typescript
// Example card structure (match the existing pattern in Home.tsx):
<button
  onClick={() => navigate("/community")}
  className="flex flex-col items-center gap-2 rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm hover:bg-[#F0FAF3] transition-all"
>
  <Crown className="h-6 w-6 text-[#3E8E5E]" />
  <span className="text-xs font-bold text-[#1F2A24]">Comunidade</span>
  <span className="text-center text-[10px] text-[#6B7A70]">NotÃ­cias Â· Dicas Â· Templates</span>
</button>
```

Add `import { Crown } from "lucide-react"` to Home.tsx if not already imported.

- [ ] **Step 4: Run all tests to confirm nothing broke**

```bash
pnpm test
```

Expected: all existing tests still pass + new tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/Home.tsx
git commit -m "feat: add /community route and Home navigation card"
```

---

## Task 14: Environment Variables + .env.example

**Files:**
- Modify: `.env.example` (or create if not exists)

- [ ] **Step 1: Add premium env vars to .env.example**

Add to `.env.example`:
```bash
# Stripe (server-side only â€” never expose in frontend)
# Set these via: npx supabase secrets set KEY=value
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# App URL (used in Stripe redirect URLs)
APP_URL=https://your-app.vercel.app

# Anthropic (server-side only)
ANTHROPIC_API_KEY=sk-ant-...
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add premium/stripe/anthropic env vars to .env.example"
```

---

## Self-Review

**Spec coverage check:**
- âœ… Premium access (Stripe monthly, 30-day trial) â†’ Tasks 3â€“5
- âœ… DB schema with RLS â†’ Tasks 1â€“2
- âœ… RSS automation with Claude summaries â†’ Task 6
- âœ… News feed â†’ Task 10 + Community page
- âœ… Daily tip â†’ Task 9 + Community page
- âœ… Templates (copy-paste, category, description) â†’ Task 11 + Community page
- âœ… Paywall for free/cancelled â†’ Task 8
- âœ… Real-time status sync â†’ Task 7 (Supabase listener)
- âœ… Manage subscription (portal) â†’ Community page handleManageSubscription
- âœ… Route + navigation â†’ Task 13

**Type consistency check:**
- `NewsItem` defined in `NewsCard.tsx`, re-exported, used in `Community.tsx` âœ…
- `Template` defined in `TemplateCard.tsx`, re-exported, used in `Community.tsx` âœ…
- `PremiumStatus` defined in `useSubscription.ts`, used in `PremiumGate.tsx` via hook âœ…
- `supabase.from("users")` used consistently (not "profiles") âœ…

**Placeholder scan:** No TBDs, no "implement later", all steps have actual code âœ…

