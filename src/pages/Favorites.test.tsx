import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Favorites from "./Favorites"

// Mock AppBottomNav to avoid full routing dependency
vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

function renderFavorites(initialRoute = "/favorites") {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/skills" element={<div>Skills Page</div>} />
        <Route path="/learn" element={<div>Learn Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("Favorites — renderização", () => {
  it("exibe o título 'Favoritos'", () => {
    renderFavorites()
    expect(screen.getByText("Favoritos")).toBeInTheDocument()
  })

  it("exibe as 4 abas de navegação", () => {
    renderFavorites()
    expect(screen.getByText("Prompts")).toBeInTheDocument()
    expect(screen.getByText("Templates")).toBeInTheDocument()
    expect(screen.getByText("Notícias")).toBeInTheDocument()
    expect(screen.getByText("Trilhas")).toBeInTheDocument()
  })

  it("exibe o estado vazio com texto 'Você ainda não tem favoritos'", () => {
    renderFavorites()
    expect(screen.getByText("Você ainda não tem favoritos")).toBeInTheDocument()
  })

  it("exibe o botão CTA 'Explorar conteúdo'", () => {
    renderFavorites()
    expect(screen.getByText("Explorar conteúdo")).toBeInTheDocument()
  })

  it("exibe a seção 'Dicas para você'", () => {
    renderFavorites()
    expect(screen.getByText("Dicas para você")).toBeInTheDocument()
  })

  it("renderiza a bottom nav", () => {
    renderFavorites()
    expect(screen.getByTestId("bottom-nav")).toBeInTheDocument()
  })
})

describe("Favorites — interação", () => {
  it("troca de aba ao clicar em 'Templates'", async () => {
    renderFavorites()
    const templatesTab = screen.getByText("Templates")
    await userEvent.click(templatesTab)

    // Active tab should be Templates (check it has the green active style)
    expect(templatesTab.closest("button")).toHaveClass("bg-primary-dark")
  })

  it("troca de aba ao clicar em 'Trilhas'", async () => {
    renderFavorites()
    await userEvent.click(screen.getByText("Trilhas"))

    // CTA should still be present
    expect(screen.getByText("Explorar conteúdo")).toBeInTheDocument()
  })

  it("navega para /skills ao clicar no CTA na aba Prompts", async () => {
    renderFavorites()
    await userEvent.click(screen.getByText("Explorar conteúdo"))
    await waitFor(() => {
      expect(screen.getByText("Skills Page")).toBeInTheDocument()
    })
  })

  it("navega para a sugestão ao clicar em 'Explorar conteúdos'", async () => {
    renderFavorites()
    await userEvent.click(screen.getByText("Explorar conteúdos"))
    await waitFor(() => {
      expect(screen.getByText("Skills Page")).toBeInTheDocument()
    })
  })
})

describe("Favorites — navegação", () => {
  it("volta para Home pelo botão de voltar", async () => {
    renderFavorites()
    const backButton = screen.getByLabelText("Voltar")
    await userEvent.click(backButton)
    await waitFor(() => {
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })
})
