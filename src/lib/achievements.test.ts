import { describe, expect, it, vi, afterEach } from "vitest"
import { getDaysSinceLastVisit } from "@/lib/achievements"

describe("getDaysSinceLastVisit", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns null when there is no prior visit", () => {
    expect(getDaysSinceLastVisit(null)).toBeNull()
  })

  it("returns 0 when the last visit was today", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-07-07T10:00:00Z"))
    expect(getDaysSinceLastVisit("2026-07-07")).toBe(0)
  })

  it("returns 1 when the last visit was yesterday", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-07-07T10:00:00Z"))
    expect(getDaysSinceLastVisit("2026-07-06")).toBe(1)
  })

  it("returns 2+ when the user was away for 2 or more days", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-07-07T10:00:00Z"))
    expect(getDaysSinceLastVisit("2026-07-05")).toBe(2)
    expect(getDaysSinceLastVisit("2026-06-20")).toBe(17)
  })
})
