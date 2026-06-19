import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import Settings from "./Settings"

// Mock only external dependencies — NOT the Switch so snapshot captures real Radix UI
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "test-user" }, logout: vi.fn() }),
}))

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="app-bottom-nav" />,
}))

vi.mock("@/components/AppPageHeader", () => ({
  AppPageHeader: ({ title }: any) => <div data-testid="app-page-header">{title}</div>,
}))

vi.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}))

vi.mock("sileo", () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

let mockReminderEnabled = true

vi.mock("@/hooks/useInactiveReminder", () => ({
  getReminderEnabled: () => mockReminderEnabled,
  setReminderEnabled: vi.fn(),
}))

function renderSettings() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  mockReminderEnabled = true
})

describe("Settings — toggles", () => {
  it("renderiza 3 switches (notificações, som, lembrete)", () => {
    renderSettings()
    const switches = screen.getAllByRole("switch")
    expect(switches).toHaveLength(3)
  })

  it("todos os switches iniciam no estado 'checked' quando habilitados", () => {
    renderSettings()
    const switches = screen.getAllByRole("switch")
    switches.forEach((s) => {
      expect(s).toHaveAttribute("data-state", "checked")
    })
  })

  it("switch de lembrete inicia 'checked' por padrão", () => {
    renderSettings()
    const switches = screen.getAllByRole("switch")
    expect(switches[2]).toHaveAttribute("data-state", "checked")
  })

  it("alterna para 'unchecked' ao clicar no switch", async () => {
    const user = userEvent.setup()
    renderSettings()
    const switches = screen.getAllByRole("switch")

    await user.click(switches[0])
    expect(switches[0]).toHaveAttribute("data-state", "unchecked")
  })

  it("alterna para 'checked' novamente ao clicar duas vezes", async () => {
    const user = userEvent.setup()
    renderSettings()
    const switches = screen.getAllByRole("switch")

    await user.click(switches[0])
    expect(switches[0]).toHaveAttribute("data-state", "unchecked")

    await user.click(switches[0])
    expect(switches[0]).toHaveAttribute("data-state", "checked")
  })

  it("renderiza switch de lembrete como 'unchecked' quando desabilitado nas preferências", () => {
    mockReminderEnabled = false
    renderSettings()
    const switches = screen.getAllByRole("switch")
    // O terceiro switch (lembrete diário) deve estar unchecked
    expect(switches[2]).toHaveAttribute("data-state", "unchecked")
  })
})

describe("Settings — snapshot", () => {
  it("corresponde ao snapshot com todos os toggles habilitados", () => {
    const { container } = renderSettings()
    expect(container).toMatchSnapshot()
  })

  it("corresponde ao snapshot com lembrete diário desabilitado", () => {
    mockReminderEnabled = false
    const { container } = renderSettings()
    expect(container).toMatchSnapshot()
  })
})

describe("Settings — labels", () => {
  it("exibe o label 'Notificações push'", () => {
    renderSettings()
    expect(screen.getByText("Notificações push")).toBeInTheDocument()
  })

  it("exibe o label 'Sons e efeitos'", () => {
    renderSettings()
    expect(screen.getByText("Sons e efeitos")).toBeInTheDocument()
  })

  it("exibe o label 'Lembrete diário (streak)'", () => {
    renderSettings()
    expect(screen.getByText("Lembrete diário (streak)")).toBeInTheDocument()
  })
})
