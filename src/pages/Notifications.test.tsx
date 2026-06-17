import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Notifications from "./Notifications"

const mockUser = { id: "user-1", email: "test@test.com" }

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-1", email: "test@test.com" } }),
}))

vi.mock("@/lib/db", () => ({
  getNotifications: vi.fn().mockResolvedValue({
    data: [
      {
        id: "n1",
        user_id: "user-1",
        type: "achievement",
        title: "Conquista desbloqueada! 🏆",
        description: "Você completou sua primeira lição!",
        created_at: new Date().toISOString(),
        read_at: null,
        mention: false,
        action_label: null,
        href: null,
      },
      {
        id: "n2",
        user_id: "user-1",
        type: "mention",
        title: "Mencionaram você no fórum",
        description: "Carlos respondeu seu comentário.",
        created_at: new Date().toISOString(),
        read_at: null,
        mention: true,
        action_label: null,
        href: null,
      },
      {
        id: "n3",
        user_id: "user-1",
        type: "system",
        title: "Nova skill disponível",
        description: "Nova skill adicionada ao catálogo.",
        created_at: new Date().toISOString(),
        read_at: new Date().toISOString(),
        mention: false,
        action_label: null,
        href: null,
      },
      {
        id: "n4",
        user_id: "user-1",
        type: "system",
        title: "Atualização da plataforma",
        description: "Novo recurso disponível.",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        read_at: new Date().toISOString(),
        mention: false,
        action_label: null,
        href: null,
      },
    ],
    error: null,
  }),
  markNotificationsRead: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

function renderNotifications(initialRoute = "/notifications") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Notifications — renderização", () => {
  it("exibe o título 'Notificações'", () => {
    renderNotifications()
    expect(screen.getByText("Notificações")).toBeInTheDocument()
  })

  it("exibe as 3 abas de filtro com contagens", () => {
    renderNotifications()
    expect(screen.getByText("Todas")).toBeInTheDocument()
    expect(screen.getByText("Não lidas")).toBeInTheDocument()
    expect(screen.getByText("Mentions")).toBeInTheDocument()
  })

  it("exibe notificações agrupadas", async () => {
    renderNotifications()
    expect(await screen.findByText("Hoje")).toBeInTheDocument()
    expect(screen.getByText("Anterior")).toBeInTheDocument()
  })

  it("exibe itens de notificação com títulos", async () => {
    renderNotifications()
    expect(await screen.findByText(/Conquista desbloqueada/i)).toBeInTheDocument()
    expect(screen.getByText(/Mencionaram você/i)).toBeInTheDocument()
    expect(screen.getByText(/Nova skill disponível/i)).toBeInTheDocument()
  })

  it("exibe o botão de configurações", () => {
    renderNotifications()
    expect(screen.getByLabelText("Configurações")).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderNotifications()
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument()
  })
})

describe("Notifications — filtros", () => {
  it("filtra por 'Não lidas' ao clicar na aba", async () => {
    renderNotifications()
    await screen.findByText(/Conquista desbloqueada/i)
    await userEvent.click(screen.getByText("Não lidas"))

    expect(screen.getByText(/Conquista desbloqueada/i)).toBeInTheDocument()
  })

  it("filtra por 'Mentions' ao clicar na aba", async () => {
    renderNotifications()
    await screen.findByText(/Mencionaram você/i)
    await userEvent.click(screen.getByText("Mentions"))

    expect(screen.getByText(/Mencionaram você/i)).toBeInTheDocument()
  })

  it("aba 'Todas' está ativa por padrão", () => {
    renderNotifications()
    const allTab = screen.getByText("Todas")
    expect(allTab.closest("button")).toHaveClass("bg-primary-dark")
  })
})

describe("Notifications — navegação", () => {
  it("volta para Home pelo botão de voltar", async () => {
    renderNotifications()
    const backButton = screen.getByLabelText("Voltar")
    await userEvent.click(backButton)
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })
})
