import { test, expect } from "@playwright/test"

test.describe("Login", () => {
  test("exibe o formulário de login com campos e botão", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Senha")).toBeVisible()
    await expect(page.getByRole("button", { name: /entrar/i })).toBeVisible()
  })

  test("exibe validação de email inválido", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel("Email").fill("email-invalido")
    await page.getByLabel("Senha").fill("senha123")
    await page.getByRole("button", { name: /entrar/i }).click()
    // Deve mostrar erro de email inválido ou permanecer na mesma página
    await expect(page).toHaveURL(/\/login/)
  })

  test("navega para /signup ao clicar em Criar Conta", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: /criar conta/i }).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test("navega para /forgot-password ao clicar em Esqueci a senha", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: /esqueci|recuperar/i }).click()
    await expect(page).toHaveURL(/\/forgot-password/)
  })
})

test.describe("Signup", () => {
  test("exibe formulário de cadastro com todos os campos", async ({ page }) => {
    await page.goto("/signup")
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByLabel("Senha")).toBeVisible()
    await expect(page.getByLabel("Confirmar Senha")).toBeVisible()
    await expect(page.getByRole("button", { name: /criar/i })).toBeVisible()
  })
})

test.describe("Forgot Password", () => {
  test("exibe campo de email e botão de envio", async ({ page }) => {
    await page.goto("/forgot-password")
    await expect(page.getByLabel("Email")).toBeVisible()
    await expect(page.getByRole("button", { name: /enviar|recuperar/i })).toBeVisible()
  })
})
