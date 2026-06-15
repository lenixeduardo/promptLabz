import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Achievements from "./Achievements"
import { AchievementsProvider } from "@/contexts/AchievementsContext"

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

function renderAchievements() {
  return render(
    <MemoryRouter initialEntries={["/achievements"]}>
      <AchievementsProvider>
        <Routes>
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/home" element={<div>Home Page</div>} />
        </Routes>
      </AchievementsProvider>
    </MemoryRouter>
  )
}

describe("Achievements — página de conquistas", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza a página com título e header", () => {
    renderAchievements()
    expect(screen.getByText("Conquistas")).toBeInTheDocument()
    expect(screen.getByText("Parabéns!")).toBeInTheDocument()
  })

  it("exibe estatísticas (lições, 100%, dias)", () => {
    renderAchievements()
    expect(screen.getByText("Lições")).toBeInTheDocument()
    expect(screen.getByText("100%")).toBeInTheDocument()
    expect(screen.getByText("Dias")).toBeInTheDocument()
  })

  it("exibe progresso total com barra de progresso", () => {
    renderAchievements()
    expect(screen.getByText("Progresso Total")).toBeInTheDocument()
    expect(screen.getByText(/\d+ \/ 50 lições/)).toBeInTheDocument()
  })

  it("exibe lista de conquistas com ícones de bloqueio", () => {
    renderAchievements()
    // Deve ter pelo menos uma conquista renderizada
    const achievements = screen.getAllByRole("article")
    expect(achievements.length).toBeGreaterThan(0)
  })

  it("navega para home ao clicar no botão voltar", () => {
    renderAchievements()
    const backBtn = screen.getByLabelText("Voltar para home")
    backBtn.click()
    expect(mockNavigate).toHaveBeenCalledWith("/home")
  })

  it("exibe contador de conquistas desbloqueadas", () => {
    renderAchievements()
    // O padrão é "X de Y" onde X são desbloqueadas
    const unlockedText = screen.getByText(/\d+ de \d+/)
    expect(unlockedText).toBeInTheDocument()
  })

  it("aplicar aria-label em progresso bar para acessibilidade", () => {
    renderAchievements()
    const progressBar = screen.getByLabelText("Progresso de lições completadas")
    expect(progressBar).toHaveAttribute("role", "progressbar")
    expect(progressBar).toHaveAttribute("aria-valuemin", "0")
    expect(progressBar).toHaveAttribute("aria-valuemax", "100")
  })

  it("renderiza badges com status (desbloqueado/categoria)", () => {
    renderAchievements()
    const achievements = screen.getAllByRole("article")
    expect(achievements.length).toBeGreaterThan(0)
    // Cada achievement deve ter um badge
    achievements.forEach((article) => {
      const badgeText = article.querySelector('[class*="rounded-full"]')
      expect(badgeText).toBeInTheDocument()
    })
  })

  it("mostrar títulos e descrições de conquistas", () => {
    renderAchievements()
    const articles = screen.getAllByRole("article")
    expect(articles.length).toBeGreaterThan(0)
    // Deve haver h2 (títulos) em cada article
    const titles = screen.getAllByRole("heading", { level: 2 })
    expect(titles.length).toBeGreaterThan(0)
  })
})
