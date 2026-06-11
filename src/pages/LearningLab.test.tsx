import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import LearningLab from "./LearningLab"

import { LivesProvider } from "@/contexts/LivesContext"

const mockUser = { id: "user-1", email: "aluno@test.com" }

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser }),
}))

// Mock useAuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: () => ({ user: mockUser, loading: false, error: null }),
}))

vi.mock("@/lib/db", () => ({
  loadProgress: vi.fn().mockImplementation(() => {
    try {
      const saved = localStorage.getItem("promptlabz_progress")
      return Promise.resolve(saved ? JSON.parse(saved) : {})
    } catch {
      return Promise.resolve({})
    }
  }),
  saveProgress: vi.fn().mockResolvedValue(undefined),
}))

// Mock sileo
vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock Mascot
vi.mock("@/components/HelpButton", () => ({
  HelpButton: () => <div>help</div>,
}))

function renderLearningLab(initialUrl = "/learn") {
  return render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <LivesProvider>
        <Routes>
          <Route path="/learn" element={<LearningLab />} />
          <Route path="/home" element={<div>Home Page</div>} />
          <Route path="/lesson" element={<div>Lesson Page</div>} />
        </Routes>
      </LivesProvider>
    </MemoryRouter>
  )
}

describe("LearningLab — renderização e progresso", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("renderiza o título da categoria ativa padrão", () => {
    renderLearningLab()
    expect(screen.getByRole("heading", { name: "Trending Skills", level: 1 })).toBeInTheDocument()
  })

  it("renderiza os módulos e as lições correspondentes", () => {
    renderLearningLab()
    expect(screen.getByText("Módulo 1: IA Generativa no Cotidiano")).toBeInTheDocument()
    expect(screen.getByText("A Revolução dos Modelos de Linguagem (LLMs)")).toBeInTheDocument()
    expect(screen.getByText("Anatomia de um Prompt Eficiente")).toBeInTheDocument()
  })

  it("exibe o progresso de conclusão inicial como 0%", () => {
    renderLearningLab()
    expect(screen.getByText(/0 de \d+ lições concluídas/i)).toBeInTheDocument()
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
    const designChip = screen.getByText("Design")
    fireEvent.click(designChip)
    
    // De acordo com lessonsData, a categoria design deve ser carregada
    await waitFor(() => {
      expect(screen.getByText("Módulo 1: Engenharia de Prompts para Geração de Imagens")).toBeInTheDocument()
    })
  })

  it("exibe lição como concluída se salva no localStorage", async () => {
    // Definir progresso no localStorage
    const fakeProgress = {
      "trending-skills": {
        currentModuleIndex: 0,
        currentLessonIndex: 1,
        completedLessonIds: ["ts-mod-1-l1"]
      }
    }
    localStorage.setItem("promptlabz_progress", JSON.stringify(fakeProgress))

    renderLearningLab()

    // A primeira lição (Revolução dos LLMs) deve estar concluída
    // A segunda deve estar com o botão "Começar"
    await waitFor(() => expect(screen.getByText("Rever")).toBeInTheDocument())
    expect(screen.getByText("Começar")).toBeInTheDocument()
  })
})
