import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Premium from "./Premium"

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

function renderPremium(initialRoute = "/premium") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/premium" element={<Premium />} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Premium — renderização", () => {
  it("exibe o título 'PromptLabz Premium'", () => {
    renderPremium()
    expect(screen.getByText("PromptLabz Premium")).toBeInTheDocument()
  })

  it("exibe o texto descritivo", () => {
    renderPremium()
    expect(
      screen.getByText(/Desbloqueie todo o potencial/i)
    ).toBeInTheDocument()
  })

  it("exibe o toggle de cobrança com Anual e Mensal", () => {
    renderPremium()
    const anualNodes = screen.getAllByText("Anual")
    const mensalNodes = screen.getAllByText("Mensal")
    expect(anualNodes.length).toBeGreaterThanOrEqual(1)
    expect(mensalNodes.length).toBeGreaterThanOrEqual(1)
  })

  it("exibe o badge -40% no plano anual", () => {
    renderPremium()
    expect(screen.getByText("-40%")).toBeInTheDocument()
  })

  it("exibe o preço do plano anual", () => {
    renderPremium()
    expect(screen.getByText("R$ 29,90")).toBeInTheDocument()
  })

  it("exibe o preço do plano mensal", () => {
    renderPremium()
    expect(screen.getByText("R$ 49,90")).toBeInTheDocument()
  })

  it("exibe o CTA de entrada na lista de espera", () => {
    renderPremium()
    expect(screen.getByText("Entrar na lista de espera")).toBeInTheDocument()
  })

  it("exibe o texto indicando que premium está em breve", () => {
    renderPremium()
    expect(screen.getByText(/Premium em breve/i)).toBeInTheDocument()
  })

  it("exibe os trust badges", () => {
    renderPremium()
    expect(screen.getByText("Cancele fácil")).toBeInTheDocument()
    expect(screen.getByText("Ambiente seguro")).toBeInTheDocument()
    expect(screen.getByText("Mais de 50 mil usuários")).toBeInTheDocument()
  })

  it("exibe os benefícios inclusos", () => {
    renderPremium()
    expect(screen.getByText("Benefícios inclusos")).toBeInTheDocument()
    expect(screen.getByText("IA Ilimitada")).toBeInTheDocument()
    expect(screen.getByText("Templates Premium")).toBeInTheDocument()
    expect(screen.getByText("Certificados")).toBeInTheDocument()
    expect(screen.getByText("Skills Avançadas")).toBeInTheDocument()
    expect(screen.getByText("Suporte Prioritário")).toBeInTheDocument()
    expect(screen.getByText("Acesso Antecipado")).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderPremium()
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument()
  })
})

describe("Premium — interação", () => {
  it("plano Anual está selecionado por padrão", () => {
    renderPremium()
    // Toggle buttons have "Anual" and "Mensal" as their text content
    // Plan card titles also have "Anual" and "Mensal"
    const buttons = screen.getAllByRole("button")
    const anualToggle = buttons.find(
      (b) => b.textContent?.includes("Anual") && b.classList.contains("bg-primary-dark")
    )
    expect(anualToggle).toBeTruthy()
  })

  it("troca para Mensal ao clicar", async () => {
    renderPremium()
    const buttons = screen.getAllByRole("button")
    const mensalToggle = buttons.find(
      (b) => b.textContent?.includes("Mensal") && !b.textContent?.includes("R$")
    )
    expect(mensalToggle).toBeTruthy()
    if (mensalToggle) {
      await userEvent.click(mensalToggle)
      expect(mensalToggle).toHaveClass("bg-primary-dark")
    }
  })

  it("exibe o badge 'Mais escolhido' no plano anual", () => {
    renderPremium()
    expect(screen.getByText("Mais escolhido")).toBeInTheDocument()
  })

  it("exibe o preço antigo riscado no plano anual", () => {
    renderPremium()
    // The old price "R$ 69,90" has line-through styling and might be split across elements
    const allElements = screen.getAllByText(/69,90/)
    expect(allElements.length).toBeGreaterThanOrEqual(1)
  })
})

describe("Premium — navegação", () => {
  it("volta para Home pelo botão de voltar", async () => {
    renderPremium()
    const backButton = screen.getByLabelText("Voltar")
    await userEvent.click(backButton)
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })
})
