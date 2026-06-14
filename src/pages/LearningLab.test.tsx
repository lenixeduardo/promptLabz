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
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

describe("LearningLab - renderizacao e progresso", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza o titulo da categoria ativa padrao", () => {
    renderLearningLab()
    expect(screen.getByRole("heading", { name: "Todos os Cursos", level: 1 })).toBeInTheDocument()
  })

  it("renderiza os modulos e as licoes correspondentes", () => {
    renderLearningLab()
    expect(screen.getByText("Trending Skills")).toBeInTheDocument()
    expect(screen.getAllByText(/módulo/).length).toBeGreaterThan(0)
  })

  it("exibe o progresso de conclusao inicial como 0%", () => {
    renderLearningLab()
    expect(screen.getAllByText(/^0\/\d+ concluídas$/).length).toBeGreaterThan(0)
  })

  it("lista trilhas profissionais novas no seletor do lab", () => {
    renderLearningLab()
    expect(screen.getByText("Orquestracao de Agentes")).toBeInTheDocument()
    expect(screen.getByText("IA para Financeiro")).toBeInTheDocument()
    expect(screen.getByText("IA para Marketing")).toBeInTheDocument()
    expect(screen.getByText("IA para Projetos")).toBeInTheDocument()
  })

  it("muda a categoria ativa quando selecionado outro chip de categoria", async () => {
    renderLearningLab()
    fireEvent.click(screen.getByText("Design"))

    await waitFor(() => {
      expect(screen.getByText(/Engenharia de Prompts para Geração de Imagens/i)).toBeInTheDocument()
    })
  })

  it("exibe licao como concluida se salva no localStorage", async () => {
    const fakeProgress = {
      "trending-skills": {
        currentModuleIndex: 0,
        currentLessonIndex: 1,
        completedLessonIds: ["ts-mod-1-l1"],
      },
    }
    localStorage.setItem(`promptlabz_progress:${mockUser.id}`, JSON.stringify(fakeProgress))

    renderLearningLab("/learn?category=trending-skills")

    await waitFor(() => expect(screen.getByText("Rever")).toBeInTheDocument())
    expect(screen.getByRole("button", { name: /come/i })).toBeInTheDocument()
  })
})
