import { test, expect } from "@playwright/test"

test.describe("Hero / Landing", () => {
  test("exibe a página inicial com título e CTA", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1").first()).toBeVisible()
    // Hero page deve ter link para login
    await expect(page.getByRole("link", { name: /entrar/i }).first()).toBeVisible()
  })
})

test.describe("Protected Routes", () => {
  test("redireciona usuário não autenticado de /home para /login", async ({ page }) => {
    await page.goto("/home")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /profile para /login", async ({ page }) => {
    await page.goto("/profile")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /learn para /login", async ({ page }) => {
    await page.goto("/learn")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /skills para /login", async ({ page }) => {
    await page.goto("/skills")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /favorites para /login", async ({ page }) => {
    await page.goto("/favorites")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /notifications para /login", async ({ page }) => {
    await page.goto("/notifications")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redireciona usuário não autenticado de /premium para /login", async ({ page }) => {
    await page.goto("/premium")
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe("Public Routes", () => {
  test("página de login é acessível sem autenticação", async ({ page }) => {
    await page.goto("/login")
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole("heading", { name: /entrar|login/i })).toBeVisible()
  })

  test("página de cadastro é acessível sem autenticação", async ({ page }) => {
    await page.goto("/signup")
    await expect(page).toHaveURL(/\/signup/)
  })

  test("página de recuperar senha é acessível sem autenticação", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(page).toHaveURL(/\/forgot-password/)
  })

  test("página de redefinir senha é acessível sem autenticação", async ({ page }) => {
    await page.goto("/reset-password")
    await expect(page).toHaveURL(/\/reset-password/)
  })
})
