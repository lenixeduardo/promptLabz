import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import LearningLab from "./LearningLab"

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { email: "aluno@test.com" } }),
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
      <Routes>
        <Route path="/learn" element={<LearningLab />} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/lesson" element={<div>Lesson Page</div>} />
      </Routes>
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

  it("muda a categoria ativa quando selecionado outro chip de categoria", async () => {
    renderLearningLab()
    const designChip = screen.getByText("Design")
    fireEvent.click(designChip)
    
    // De acordo com lessonsData, a categoria design deve ser carregada
    await waitFor(() => {
      expect(screen.getByText("Módulo 1: Engenharia de Prompts para Geração de Imagens")).toBeInTheDocument()
    })
  })

  it("exibe lição como concluída se salva no localStorage", () => {
    // Definir progresso no localStorage
    const fakeProgress = {
      "trending-skills": {
        currentModuleIndex: 0,
        currentLessonIndex: 1,
        completedLessonIds: ["ts-mod-1-l1"]
      }
    }
    localStorage.setItem("promptlab_progress", JSON.stringify(fakeProgress))

    renderLearningLab()

    // A primeira lição (Revolução dos LLMs) deve estar concluída
    // A segunda deve estar com o botão "Começar"
    expect(screen.getByText("Rever")).toBeInTheDocument()
    expect(screen.getByText("Começar")).toBeInTheDocument()
  })
})
