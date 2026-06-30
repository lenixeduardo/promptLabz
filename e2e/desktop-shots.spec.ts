import { test } from "@playwright/test"

test.describe("Desktop Screenshots", () => {
  test("hero page desktop 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")
    await page.waitForSelector("h1", { timeout: 10000 })
    await page.waitForTimeout(2000)
    await page.screenshot({ path: "screenshots/desktop-01-hero.png", fullPage: false })
  })

  test("login page desktop 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/login")
    await page.waitForSelector("form", { timeout: 10000 })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: "screenshots/desktop-02-login.png", fullPage: false })
  })

  test("learn redirects to login desktop 1440px", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/learn")
    await page.waitForTimeout(3000)
    await page.screenshot({ path: "screenshots/desktop-03-learn-redirect.png", fullPage: false })
  })
})
