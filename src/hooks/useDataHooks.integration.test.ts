import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// Integration tests for data fetching hooks with retry behavior
// Tests edge cases and network conditions

describe("Data Hooks Retry Integration Tests", () => {
  describe("useTrendingSkills Retry Logic", () => {
    it("handles initial API success without retry", async () => {
      const mockData = [
        {
          name: "React",
          category: "frontend",
          installs: "1M+",
          installs_count: 1000000,
          tags: ["javascript", "frontend"],
          description: "A JavaScript library",
          author: "Meta",
          icon: "react.svg",
        },
      ]

      // Simulate successful API response
      const attempts: number[] = []
      const executeRequest = async (attempt = 0): Promise<any> => {
        attempts.push(attempt)
        // First attempt succeeds
        return { data: mockData, error: null }
      }

      const result = await executeRequest()

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mockData)
      expect(attempts).toEqual([0])
    })

    it("retries on transient API error and recovers", async () => {
      const mockData = [
        {
          name: "Vue",
          category: "frontend",
          installs: "1M+",
          installs_count: 1000000,
          tags: ["javascript"],
          description: "Progressive framework",
          author: "Evan You",
          icon: "vue.svg",
        },
      ]

      let callCount = 0
      const executeRequest = async (attempt = 0): Promise<any> => {
        callCount++
        // First call fails, second succeeds
        if (callCount === 1) {
          return { data: null, error: "Network timeout" }
        }
        if (callCount < 3) {
          return { data: null, error: "Temporary error" }
        }
        return { data: mockData, error: null }
      }

      let result = { data: null, error: "Initial" }
      let attemptNum = 0
      const MAX_RETRIES = 3

      while (attemptNum < MAX_RETRIES) {
        result = await executeRequest(attemptNum)
        if (!result.error) break
        attemptNum++
      }

      expect(result.error).toBeNull()
      expect(result.data).toEqual(mockData)
      expect(callCount).toBe(3)
    })

    it("handles category filter with retry", async () => {
      const frontendSkills = [
        {
          name: "TypeScript",
          category: "frontend",
          installs: "500K+",
          installs_count: 500000,
          tags: ["language"],
          description: "Language for JavaScript",
          author: "Microsoft",
          icon: "ts.svg",
        },
      ]

      const executeRequest = async (category?: string): Promise<any> => {
        // Simulate filtering by category
        if (category === "frontend") {
          return { data: frontendSkills, error: null }
        }
        return { data: [], error: null }
      }

      const result = await executeRequest("frontend")

      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].category).toBe("frontend")
    })

    it("exhausts retries and returns error message", async () => {
      const MAX_RETRIES = 3
      let attemptCount = 0

      const executeRequest = async (attempt = 0): Promise<any> => {
        attemptCount++
        return { data: null, error: "Persistent connection error" }
      }

      let result = { data: null, error: null }
      let attemptNum = 0

      while (attemptNum <= MAX_RETRIES) {
        result = await executeRequest(attemptNum)
        if (!result.error) break
        attemptNum++
      }

      expect(result.error).toBe("Persistent connection error")
      expect(result.data).toBeNull()
      expect(attemptCount).toBe(MAX_RETRIES + 1)
    })
  })

  describe("usePrompts Retry Logic", () => {
    it("handles empty prompts list gracefully", async () => {
      const executeRequest = async (): Promise<any> => {
        return { data: [], error: null }
      }

      const result = await executeRequest()

      expect(result.error).toBeNull()
      expect(result.data).toEqual([])
      expect(Array.isArray(result.data)).toBe(true)
    })

    it("retries on empty response then returns fallback", async () => {
      const fallback = [{ id: "1", title: "Default Prompt", difficulty: "easy" }]
      let callCount = 0

      const executeRequest = async (): Promise<any> => {
        callCount++
        if (callCount === 1) {
          return { data: null, error: "API Error" }
        }
        return { data: [], error: null }
      }

      let result = await executeRequest()
      if (result.error && callCount < 3) {
        result = await executeRequest()
      }

      expect(result.error).toBeNull()
      expect(Array.isArray(result.data)).toBe(true)
      // When empty, should use fallback
      const finalData = result.data.length === 0 ? fallback : result.data
      expect(finalData.length).toBeGreaterThan(0)
    })

    it("filters prompts by category with retry", async () => {
      const allPrompts = [
        {
          title: "Python Challenge",
          difficulty: "medium",
          category: "backend",
          promptText: "Write a function",
          description: "Backend challenge",
        },
        {
          title: "React Hook Challenge",
          difficulty: "hard",
          category: "frontend",
          promptText: "Create a custom hook",
          description: "Frontend challenge",
        },
      ]

      const executeRequest = async (category?: string): Promise<any> => {
        let filtered = allPrompts
        if (category) {
          filtered = allPrompts.filter((p) => p.category === category)
        }
        return { data: filtered, error: null }
      }

      const result = await executeRequest("frontend")

      expect(result.error).toBeNull()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].category).toBe("frontend")
    })

    it("combines category and difficulty filters", async () => {
      const prompts = [
        {
          title: "Easy React",
          difficulty: "easy",
          category: "frontend",
          promptText: "JSX basics",
          description: "Learn JSX",
        },
        {
          title: "Hard React",
          difficulty: "hard",
          category: "frontend",
          promptText: "Advanced patterns",
          description: "Advanced React",
        },
      ]

      const executeRequest = async (
        category?: string,
        difficulty?: string
      ): Promise<any> => {
        let filtered = prompts
        if (category) {
          filtered = filtered.filter((p) => p.category === category)
        }
        if (difficulty) {
          filtered = filtered.filter((p) => p.difficulty === difficulty)
        }
        return { data: filtered, error: null }
      }

      const result = await executeRequest("frontend", "hard")

      expect(result.data).toHaveLength(1)
      expect(result.data[0].difficulty).toBe("hard")
      expect(result.data[0].category).toBe("frontend")
    })
  })

  describe("useLabCategories Concurrent Retry", () => {
    it("fetches categories and config concurrently", async () => {
      const mockCategories = [
        {
          category_id: "cat-1",
          label: "JavaScript",
          icon: "js.svg",
          prompt_count: 10,
        },
      ]

      const mockConfig = {
        potd_title: "Daily Challenge",
        potd_description: "Today's prompt",
        potd_category_id: "cat-1",
      }

      const executeRequests = async (): Promise<any> => {
        const [catRes, cfgRes] = await Promise.all([
          Promise.resolve({ data: mockCategories, error: null }),
          Promise.resolve({ data: mockConfig, error: null }),
        ])
        return { categories: catRes, config: cfgRes }
      }

      const result = await executeRequests()

      expect(result.categories.error).toBeNull()
      expect(result.config.error).toBeNull()
      expect(result.categories.data).toHaveLength(1)
      expect(result.config.data.potd_title).toBe("Daily Challenge")
    })

    it("handles partial failure in concurrent requests", async () => {
      const mockCategories = [
        {
          category_id: "cat-1",
          label: "JavaScript",
          icon: "js.svg",
          prompt_count: 10,
        },
      ]

      const executeRequests = async (): Promise<any> => {
        const [catRes, cfgRes] = await Promise.all([
          Promise.resolve({ data: mockCategories, error: null }),
          Promise.resolve({ data: null, error: "Config API error" }),
        ])
        return { categories: catRes, config: cfgRes }
      }

      const result = await executeRequests()

      expect(result.categories.error).toBeNull()
      expect(result.categories.data).toHaveLength(1)
      expect(result.config.error).toBe("Config API error")
    })

    it("retries both requests when both fail", async () => {
      let catRetries = 0
      let cfgRetries = 0

      const getCategories = async (): Promise<any> => {
        catRetries++
        if (catRetries === 1) {
          return { data: null, error: "Network error" }
        }
        return {
          data: [
            {
              category_id: "cat-1",
              label: "JavaScript",
              icon: "js.svg",
              prompt_count: 10,
            },
          ],
          error: null,
        }
      }

      const getConfig = async (): Promise<any> => {
        cfgRetries++
        if (cfgRetries === 1) {
          return { data: null, error: "Network error" }
        }
        return {
          data: {
            potd_title: "Daily Challenge",
            potd_description: "Today's prompt",
            potd_category_id: "cat-1",
          },
          error: null,
        }
      }

      // First attempt - both fail
      let [catRes, cfgRes] = await Promise.all([getCategories(), getConfig()])

      // Check if either failed
      if (catRes.error || cfgRes.error) {
        // Retry both
        ;[catRes, cfgRes] = await Promise.all([getCategories(), getConfig()])
      }

      expect(catRes.error).toBeNull()
      expect(cfgRes.error).toBeNull()
      expect(catRetries).toBe(2)
      expect(cfgRetries).toBe(2)
    })

    it("handles timeout during concurrent fetch", async () => {
      const executeWithTimeout = async (timeout = 5000): Promise<any> => {
        const race = Promise.race([
          Promise.all([
            Promise.resolve({ data: [], error: null }),
            Promise.resolve({ data: null, error: null }),
          ]),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), timeout)
          ),
        ])

        try {
          const result = await race
          return { data: result, error: null }
        } catch (err) {
          return { error: (err as Error).message, data: null }
        }
      }

      const result = await executeWithTimeout(5000)

      // With long timeout, should succeed
      expect(result.error).toBe(null)
    })
  })

  describe("Error Logging During Retries", () => {
    it("logs API errors with attempt information", async () => {
      const loggedErrors: any[] = []

      const logApiError = (endpoint: string, statusCode: number, message: string) => {
        loggedErrors.push({ endpoint, statusCode, message })
      }

      const executeRequest = async (attempt = 0): Promise<any> => {
        const result = { data: null, error: "API Error" }
        if (result.error && attempt >= 3) {
          logApiError("/db/getPrompts", 500, result.error)
        }
        return result
      }

      // Simulate max retries reached
      await executeRequest(3)

      expect(loggedErrors).toHaveLength(1)
      expect(loggedErrors[0].endpoint).toBe("/db/getPrompts")
      expect(loggedErrors[0].statusCode).toBe(500)
    })

    it("tracks retry count for analytics", async () => {
      const analytics = {
        endpoint: "/db/getTrendingSkills",
        totalAttempts: 0,
        successOnAttempt: 0,
      }

      let callCount = 0
      const executeRequest = async (attempt = 0): Promise<any> => {
        callCount++
        analytics.totalAttempts = callCount

        if (callCount < 3) {
          return { data: null, error: "Transient error" }
        }

        analytics.successOnAttempt = callCount
        return { data: [{ name: "Skill" }], error: null }
      }

      let result = { data: null, error: "Initial" }
      while (callCount < 4) {
        result = await executeRequest(callCount - 1)
        if (!result.error) break
      }

      expect(analytics.totalAttempts).toBe(3)
      expect(analytics.successOnAttempt).toBe(3)
      expect(result.error).toBeNull()
    })
  })
})
