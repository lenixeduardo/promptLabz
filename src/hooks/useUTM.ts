/**
 * useUTM — capture, persist and retrieve UTM parameters across the SPA.
 *
 * Google Ads appends ?utm_source=google&utm_medium=cpc&utm_campaign=... to the
 * landing URL. Because React Router is client-side, we must capture those params
 * on first load (before they disappear on route change) and persist them for the
 * duration of the session so they can be sent alongside conversion events.
 *
 * Usage:
 *   const utm = useUTM()
 *   // utm = { source: "google", medium: "cpc", campaign: "prompts-br", ... }
 *
 * Call once at the top of App (or any always-mounted component) so params are
 * captured immediately. Subsequent calls from any component just read from
 * sessionStorage — no re-parsing needed.
 */

import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

export interface UTMParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
  /** Google Ads click ID — required for Google Ads conversion import */
  gclid?: string
}

const SESSION_KEY = "promptlabz_utm"

/** Parse UTM params from a URLSearchParams object. */
function parseUTM(params: URLSearchParams): UTMParams {
  const result: UTMParams = {}
  if (params.get("utm_source")) result.source = params.get("utm_source")!
  if (params.get("utm_medium")) result.medium = params.get("utm_medium")!
  if (params.get("utm_campaign")) result.campaign = params.get("utm_campaign")!
  if (params.get("utm_term")) result.term = params.get("utm_term")!
  if (params.get("utm_content")) result.content = params.get("utm_content")!
  if (params.get("gclid")) result.gclid = params.get("gclid")!
  return result
}

/** Save UTM params to sessionStorage (survives route changes, not tab close). */
function saveUTM(utm: UTMParams): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(utm))
  } catch {
    // sessionStorage may be unavailable in private browsing — fail silently
  }
}

/** Read saved UTM params from sessionStorage. */
export function readUTM(): UTMParams {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as UTMParams) : {}
  } catch {
    return {}
  }
}

/**
 * Hook — call once in a top-level component (e.g. AnalyticsTracker in App.tsx).
 * On mount it reads the URL, saves any UTM/gclid it finds, and returns the
 * current UTM params. On subsequent route changes it does nothing (params are
 * already saved).
 */
export function useUTM(): UTMParams {
  const location = useLocation()
  const captured = useRef(false)

  useEffect(() => {
    if (captured.current) return // only capture once per session

    const params = new URLSearchParams(location.search)
    const utm = parseUTM(params)

    // Only persist if at least one param was found
    if (Object.keys(utm).length > 0) {
      saveUTM(utm)
      captured.current = true
    }
  }, [location.search])

  return readUTM()
}
