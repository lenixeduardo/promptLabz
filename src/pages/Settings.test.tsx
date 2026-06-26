import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import Settings from "./Settings"

const mockLogout = vi.fn()
const mockNavigate = vi.fn()

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "test-user" }, logout: mockLogout }),
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="app-bottom-nav" />,
}))

vi.mock("@/components/AppPageHeader", () => ({
  AppPageHeader: ({ title }: { title: string }) => (
    <div data-testid="app-page-header">{title}</div>
  ),
}))

vi.mock("@/components/ReviewModal", () => ({
  ReviewModal: ({ open }: { open: boolean; onOpenChange: (v: boolean) => void }) =>
    open ? <div data-testid="review-modal" /> : null,
}))

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Settings — renderização", () => {
  it("renderiza o header com título 'Configurações'", () => {
    renderSettings()
    expect(screen.getByTestId("app-page-header")).toHaveTextContent("Configurações")
  })

  it("renderiza a seção 'Acesso Rápido'", () => {
    renderSettings()
    expect(screen.getByText(/acesso rápido/i)).toBeInTheDocument()
  })

  it("renderiza o botão 'Configurar Back Tap'", () => {
    renderSettings()
    expect(screen.getByText("Configurar Back Tap")).toBeInTheDocument()
  })

  it("renderiza o botão 'Abrir Ajustes'", () => {
    renderSettings()
    expect(screen.getByRole("button", { name: /abrir ajustes/i })).toBeInTheDocument()
  })

  it("renderiza os 4 passos do Back Tap", () => {
    renderSettings()
    expect(screen.getByText(/abra o app atalhos/i)).toBeInTheDocument()
    expect(screen.getByText(/novo atalho.*abrir url/i)).toBeInTheDocument()
    expect(screen.getByText(/ajustes.*acessibilidade/i)).toBeInTheDocument()
    expect(screen.getByText(/back tap.*toque duplo/i)).toBeInTheDocument()
  })

  it("renderiza o botão de logout", () => {
    renderSettings()
    expect(screen.getByRole("button", { name: /sair da conta/i })).toBeInTheDocument()
  })

  it("renderiza a seção de feedback com 'Avalie nosso projeto'", () => {
    renderSettings()
    expect(screen.getByText(/avalie nosso projeto/i)).toBeInTheDocument()
  })

  it("renderiza a versão do app", () => {
    renderSettings()
    expect(screen.getByText(/promptlabz.*v0\.3/i)).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderSettings()
    expect(screen.getByTestId("app-bottom-nav")).toBeInTheDocument()
  })
})

describe("Settings — logout", () => {
  it("chama logout e navega para /login ao clicar em 'Sair da conta'", async () => {
    mockLogout.mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderSettings()

    await user.click(screen.getByRole("button", { name: /sair da conta/i }))

    await waitFor(() => expect(mockLogout).toHaveBeenCalledOnce())
    expect(mockNavigate).toHaveBeenCalledWith("/login")
  })

  it("exibe 'Saindo...' enquanto logout está em andamento", async () => {
    mockLogout.mockImplementation(() => new Promise(() => {}))
    const user = userEvent.setup()
    renderSettings()

    await user.click(screen.getByRole("button", { name: /sair da conta/i }))

    expect(screen.getByRole("button", { name: /saindo/i })).toBeDisabled()
  })
})

describe("Settings — modal de avaliação", () => {
  it("abre o ReviewModal ao clicar em 'Avalie nosso projeto'", async () => {
    const user = userEvent.setup()
    renderSettings()

    expect(screen.queryByTestId("review-modal")).not.toBeInTheDocument()
    await user.click(screen.getByText(/avalie nosso projeto/i))
    expect(screen.getByTestId("review-modal")).toBeInTheDocument()
  })
})
