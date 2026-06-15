import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Notifications from "./Notifications"

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

  it("exibe notificações agrupadas", () => {
    renderNotifications()
    expect(screen.getByText("Hoje")).toBeInTheDocument()
    expect(screen.getByText("Anterior")).toBeInTheDocument()
  })

  it("exibe itens de notificação com títulos", () => {
    renderNotifications()
    expect(screen.getByText(/Conquista desbloqueada/i)).toBeInTheDocument()
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
    await userEvent.click(screen.getByText("Não lidas"))

    // "Conquista desbloqueada" is unread, should still be visible
    expect(screen.getByText(/Conquista desbloqueada/i)).toBeInTheDocument()
  })

  it("filtra por 'Mentions' ao clicar na aba", async () => {
    renderNotifications()
    await userEvent.click(screen.getByText("Mentions"))

    // "Mencionaram você" is a mention, should be visible
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
