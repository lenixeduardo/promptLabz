import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import LearningLab from "./LearningLab"

import { LivesProvider } from "@/contexts/LivesContext"
import { AchievementsProvider } from "@/contexts/AchievementsContext"

const mockUser = { id: "user-1", email: "aluno@test.com" }

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser }),
}))

vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: () => ({ user: mockUser, loading: false, error: null }),
}))

vi.mock("@/lib/db", () => ({
  loadProgress: vi.fn().mockImplementation(() => {
    try {
      const saved = localStorage.getItem(`promptlabz_progress:${mockUser.id}`)
      return Promise.resolve(saved ? JSON.parse(saved) : {})
    } catch {
      return Promise.resolve({})
    }
  }),
  saveProgress: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("sileo", () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
}))

vi.mock("@/components/HelpButton", () => ({
  HelpButton: () => <div>help</div>,
}))

function renderLearningLab(initialUrl = "/learn") {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <LivesProvider>
        <AchievementsProvider>
          <Routes>
            <Route path="/learn" element={<LearningLab />} />
            <Route path="/home" element={<div>Home Page</div>} />
            <Route path="/lesson" element={<div>Lesson Page</div>} />
          </Routes>
        </AchievementsProvider>
      </LivesProvider>
    </MemoryRouter>
  )
}

// ─── Tela de lista de cursos (/learn) ───────────────────────────────────────

describe("LearningLab - lista de cursos (Trilha de Aprendizado)", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza o titulo 'Trilha de Aprendizado'", () => {
    renderLearningLab()
    expect(screen.getByRole("heading", { name: /Trilha de Aprendizado/i, level: 1 })).toBeInTheDocument()
  })

  it("exibe o subtítulo correto", () => {
    renderLearningLab()
    expect(screen.getByText(/Aprenda do básico ao avançado/i)).toBeInTheDocument()
  })

  it("exibe o primeiro curso como acessível", () => {
    renderLearningLab()
    expect(screen.getByText("Trending Skills")).toBeInTheDocument()
  })

  it("lista trilhas profissionais novas no seletor do lab", () => {
    renderLearningLab()
    expect(screen.getByText("Orquestracao de Agentes")).toBeInTheDocument()
    expect(screen.getByText("IA para Financeiro")).toBeInTheDocument()
  })

  it("exibe ícones de cadeado nos cursos bloqueados", () => {
    renderLearningLab()
    const lockIcons = document.querySelectorAll("button[disabled]")
    expect(lockIcons.length).toBeGreaterThan(0)
  })

  it("navega para a trilha ao clicar no primeiro curso", async () => {
    renderLearningLab()
    fireEvent.click(screen.getByText("Trending Skills"))
    await waitFor(() => {
      expect(screen.getByText(/Seu progresso na trilha/i)).toBeInTheDocument()
    })
  })
})

// ─── Tela de trilha de ensino (/learn?category=...) ─────────────────────────

describe("LearningLab - trilha de ensino (trail view)", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza o titulo da categoria ativa", () => {
    renderLearningLab("/learn?category=trending-skills")
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Trending Skills")
  })

  it("exibe o card de progresso com 0% inicial", () => {
    renderLearningLab("/learn?category=trending-skills")
    expect(screen.getByText("0%")).toBeInTheDocument()
    expect(screen.getByText(/Seu progresso na trilha/i)).toBeInTheDocument()
  })

  it("renderiza os títulos das lições na trilha", () => {
    renderLearningLab("/learn?category=trending-skills")
    expect(screen.getByText(/Modelos de Linguagem/i)).toBeInTheDocument()
    expect(screen.getByText(/Anatomia de um Prompt Eficiente/i)).toBeInTheDocument()
  })

  it("exibe o botão de continuar com número da lição atual", () => {
    renderLearningLab("/learn?category=trending-skills")
    expect(screen.getByRole("button", { name: /Continuar aula 1/i })).toBeInTheDocument()
  })

  it("exibe lições como concluídas quando há progresso salvo", async () => {
    const fakeProgress = {
      "trending-skills": {
        currentModuleIndex: 0,
        currentLessonIndex: 1,
        completedLessonIds: ["ts-mod-1-l1"],
      },
    }
    localStorage.setItem(`promptlabz_progress:${mockUser.id}`, JSON.stringify(fakeProgress))

    renderLearningLab("/learn?category=trending-skills")

    await waitFor(() => {
      expect(screen.getByText("25%")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /Continuar aula 2/i })).toBeInTheDocument()
  })

  it("exibe botão para voltar para a lista de cursos", () => {
    renderLearningLab("/learn?category=trending-skills")
    const backButton = screen.getByRole("button", { name: "" })
    expect(backButton).toBeInTheDocument()
  })
})
