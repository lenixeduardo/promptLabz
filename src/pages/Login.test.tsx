import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Login from "./Login"
import { sileo } from "sileo"

const mockLogin = vi.fn()
const mockLoginWithGoogle = vi.fn()

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
    loginWithGoogle: mockLoginWithGoogle,
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
  BrandLogo: () => <div>PromptLabz</div>,
}))

function renderLogin() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<div>home</div>} />
          <Route path="/forgot-password" element={<div>esqueci senha</div>} />
          <Route path="/signup" element={<div>cadastro</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe("Login — renderização", () => {
  it("exibe campos de email e senha", () => {
    renderLogin()
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument()
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
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument()
  })

  it("não exibe 'Bem-vindo de volta' para novo usuário", () => {
    renderLogin()
    expect(screen.queryByText(/bem-vindo de volta/i)).not.toBeInTheDocument()
  })

  it("exibe 'Bem-vindo de volta' para usuário que já tem conta", () => {
    localStorage.setItem("promptlabz:hasAccount", "true")
    renderLogin()
    expect(screen.getByText(/bem-vindo de volta/i)).toBeInTheDocument()
  })
})

describe("Login — submissão", () => {
  it("navega para /home ao fazer login com sucesso", async () => {
    mockLogin.mockResolvedValue({ success: true, user: { email: "a@a.com" } })

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("E-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Senha"), "senha123")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument())
  })

  it("exibe mensagem de erro quando login falha", async () => {
    mockLogin.mockResolvedValue({ success: false, error: "Credenciais inválidas" })

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("E-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Senha"), "errada")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    await waitFor(() =>
      expect(sileo.error).toHaveBeenCalledWith({ title: "Credenciais inválidas" })
    )
  })

  it("exibe 'Entrando...' enquanto request está em andamento", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}))

    renderLogin()
    await userEvent.type(screen.getByPlaceholderText("E-mail"), "a@a.com")
    await userEvent.type(screen.getByPlaceholderText("Senha"), "senha123")
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

  it("navega para /signup ao clicar em 'criar conta'", async () => {
    renderLogin()
    await userEvent.click(screen.getByText(/criar conta/i))
    await waitFor(() =>
      expect(screen.getByText("cadastro")).toBeInTheDocument()
    )
  })
})
