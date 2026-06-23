import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useLabCategories } from "./useLabCategories"

vi.mock("@/lib/db", () => ({
  getLabCategories: vi.fn(),
  getLabConfig: vi.fn(),
}))

import * as dbModule from "@/lib/db"
const mockGetLabCategories = vi.mocked(dbModule.getLabCategories)
const mockGetLabConfig = vi.mocked(dbModule.getLabConfig)

describe("useLabCategories", () => {
  beforeEach(() => {
    mockGetLabCategories.mockClear()
    mockGetLabConfig.mockClear()
  })

  it("starts with loading state true", () => {
    mockGetLabCategories.mockResolvedValue({ data: [], error: null })
    mockGetLabConfig.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLabCategories())

    expect(result.current.loading).toBe(true)
  })

  it("sets loading to false after loading", async () => {
    mockGetLabCategories.mockResolvedValue({ data: [], error: null })
    mockGetLabConfig.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLabCategories())

    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it("handles category fetch error", async () => {
    mockGetLabCategories.mockResolvedValue({ data: null, error: "Fetch failed" })
    mockGetLabConfig.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLabCategories())

    await waitFor(() => expect(result.current.error).toBe("Fetch failed"))
  })

  it("handles promise rejection with catch", async () => {
    mockGetLabCategories.mockRejectedValue(new Error("Network error"))
    mockGetLabConfig.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLabCategories())

    await waitFor(() => expect(result.current.error).toBe("Network error"))
    expect(result.current.loading).toBe(false)
  })

  it("returns categories when fetch succeeds", async () => {
    const mockCat = { category_id: "1", label: "Test", icon: "star", prompt_count: 5 }
    mockGetLabCategories.mockResolvedValue({ data: [mockCat], error: null })
    mockGetLabConfig.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLabCategories())

    await waitFor(() => expect(result.current.categories.length).toBeGreaterThan(0))
  })

  it("handles concurrent promise rejections", async () => {
    mockGetLabCategories.mockRejectedValue(new Error("Cat error"))
    mockGetLabConfig.mockRejectedValue(new Error("Config error"))

    const { result } = renderHook(() => useLabCategories())

    await waitFor(() => expect(result.current.error).toBeDefined())
    expect(result.current.loading).toBe(false)
  })
})
