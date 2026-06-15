// ═══════════════════════════════════════════════════════════════════════════
// PostHog — Product Analytics
// ═══════════════════════════════════════════════════════════════════════════
//
// Usage:
//   import { capture, identify, pageView } from "@/lib/analytics"
//
//   capture("lesson_started", { lessonId: "ts-mod-1-l1" })
//   identify("user-uuid", { email: "user@email.com" })
//
// ═══════════════════════════════════════════════════════════════════════════

import posthog from "posthog-js"

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com"
const IS_PROD = import.meta.env.PROD
const IS_TEST = import.meta.env.MODE === "test"

/** Whether PostHog is configured and ready to use. */
export function isAnalyticsEnabled(): boolean {
  return !!POSTHOG_KEY && !IS_TEST
}

/** Initialize PostHog (call once at app startup). */
export function initAnalytics(): void {
  if (!isAnalyticsEnabled()) return
  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // we manually track page views via React Router
    loaded: (ph) => {
      if (!IS_PROD) {
        ph.opt_out_capturing() // respect DEV mode
        console.log("[analytics] PostHog initialized in DEV — opted out")
      }
    },
  })
}

/** Identify a user (call after login/signup). */
export function identify(userId: string, properties?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return
  posthog.identify(userId, properties)
}

/** Reset identity (call on logout). */
export function reset(): void {
  if (!isAnalyticsEnabled()) return
  posthog.reset()
}

/** Track a custom event. */
export function capture(event: string, properties?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return
  posthog.capture(event, properties)
}

/** Track a page view (call on every route change). */
export function pageView(path: string): void {
  capture("$pageview", { path })
}

/** Group users (e.g., by plan). */
export function group(groupType: string, groupKey: string, properties?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return
  posthog.group(groupType, groupKey, properties)
}

// ─── Convenience helpers ────────────────────────────────────────────────────

type EventProperties = Record<string, unknown>

/** Track lesson flow */
export function trackLessonStarted(lessonId: string, props?: EventProperties): void {
  capture("lesson_started", { lessonId, ...props })
}

export function trackLessonCompleted(lessonId: string, score: number, props?: EventProperties): void {
  capture("lesson_completed", { lessonId, score, ...props })
}

/** Track auth flow */
export function trackSignUp(method: string): void {
  capture("sign_up", { method })
}

export function trackLogin(method: string): void {
  capture("login", { method })
}

/** Track skill interactions */
export function trackSkillViewed(skillName: string, category: string): void {
  capture("skill_viewed", { skillName, category })
}

export function trackSkillFavorited(skillName: string): void {
  capture("skill_favorited", { skillName })
}

/** Track prompt interactions */
export function trackPromptUsed(categoryId: string, title: string): void {
  capture("prompt_used", { categoryId, title })
}

/** Track premium */
export function trackPremiumViewed(): void {
  capture("premium_viewed")
}

export function trackPremiumStarted(plan: string): void {
  capture("premium_checkout_started", { plan })
}
