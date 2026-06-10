import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Login from "./Login"
import { sileo } from "sileo"

const mockLogin = vi.fn()
const mockLoginWithGoogle = vi.fn()
const mockLoginWithApple = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithApple: mockLoginWithApple,
    user: null,
  }),
}))

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

vi.mock("@/components/CircleTransition", () => ({
  CircleRevealEntry: () => null,
}))

vi.mock("@/components/MascotGlow", () => ({
  MascotGlow: ({ children }: any) => <div>{children}</div>,
}))

vi.mock("@/components/BrandLogo", () => ({
  BrandLogo: () => <div>PromptLab</div>,
}))

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<div>home</div>} />
        <Route path="/forgot-password" element={<div>esqueci senha</div>} />
        <Route path="/signup" element={<div>cadastro</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe("Login — renderização", () => {
  it("exibe campos de email e senha", () => {
    renderLogin()
    expect(screen.getByPlaceholderText("Seu e-mail")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Sua senha")).toBeInTheDocument()
  })

  it("exibe o botão de entrar", () => {
    renderLogin()
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument()
  })

  it("exibe link para esqueci minha senha", () => {
    renderLogin()
    expect(screen.getByText(/esqueci minha senha/i)).toBeInTheDocument()
  })

  it("exibe link para criar conta", () => {
    renderLogin()
    expect(screen.getByText(/crie agora/i)).toBeInTheDocument()
  })
})

describe("Login — submissão", () => {
  it("navega para /home ao fazer login com sucesso", async () => {
    mockLogin.mockResolvedValue({ success: true, user: { email: "a@a.com" } })

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("Seu e-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Sua senha"), "senha123")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument())
  })

  it("exibe mensagem de erro quando login falha", async () => {
    mockLogin.mockResolvedValue({ success: false, error: "Credenciais inválidas" })

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("Seu e-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Sua senha"), "errada")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() =>
      expect(sileo.error).toHaveBeenCalledWith({ title: "Credenciais inválidas" })
    )
  })

  it("exibe 'Entrando...' enquanto request está em andamento", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}))

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("Seu e-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Sua senha"), "senha123")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled()
  })
})

describe("Login — navegação", () => {
  it("navega para /forgot-password ao clicar em 'Esqueci minha senha'", async () => {
    renderLogin()
    await userEvent.click(screen.getByText(/esqueci minha senha/i))
    await waitFor(() =>
      expect(screen.getByText("esqueci senha")).toBeInTheDocument()
    )
  })

  it("navega para /signup ao clicar em 'Crie agora'", async () => {
    renderLogin()
    await userEvent.click(screen.getByText(/crie agora/i))
    await waitFor(() =>
      expect(screen.getByText("cadastro")).toBeInTheDocument()
    )
  })
})
