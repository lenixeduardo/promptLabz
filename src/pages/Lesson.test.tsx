import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Lesson from "./Lesson"
import { sileo } from "sileo"
import { saveProgress } from "@/lib/db"

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

function renderLesson(url = "/lesson?category=trending-skills&moduleIndex=0&lessonIndex=0") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <LivesProvider>
        <Routes>
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/learn" element={<div>Learning Lab Page</div>} />
          <Route path="/mission" element={<div>Mission Completed Page<span>+1 Vida</span></div>} />
        </Routes>
      </LivesProvider>
    </MemoryRouter>
  )
}

describe("Lesson — fluxo de aprendizado", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("carrega a lição correta a partir dos parâmetros e exibe conteúdo inicial", () => {
    renderLesson()
    expect(screen.getByText("A Revolução dos Modelos de Linguagem (LLMs)")).toBeInTheDocument()
    expect(screen.getByText("Entendendo os Modelos de Linguagem de Larga Escala")).toBeInTheDocument()
    expect(screen.getByText("Entendi, vamos lá! →")).toBeInTheDocument()
  })

  it("navega para a primeira pergunta após clique em avançar", async () => {
    renderLesson()
    
    const nextBtn = screen.getByRole("button", { name: /entendi, vamos lá!/i })
    fireEvent.click(nextBtn)

    // Deve exibir a Questão 1
    expect(screen.getByText("Questão 1 de 2")).toBeInTheDocument()
    expect(screen.getByText("Como os Large Language Models (LLMs) geram respostas?")).toBeInTheDocument()
  })

  it("valida respostas de múltipla escolha corretas e incorretas", async () => {
    renderLesson()

    // Ir para a questão
    fireEvent.click(screen.getByRole("button", { name: /entendi, vamos lá!/i }))

    // Selecionar a resposta correta ("B")
    const optionB = screen.getByText("Prevendo a próxima palavra mais provável de acordo com o contexto estatístico fornecido.")
    fireEvent.click(optionB)

    // Confirmar resposta
    const confirmBtn = screen.getByRole("button", { name: /confirmar resposta/i })
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(sileo.success).toHaveBeenCalledWith({ title: "Correto!", description: "Muito bem! 🎉" })
    })

    // Deve exibir botão para Próxima
    expect(screen.getByRole("button", { name: /^Próxima →$/ })).toBeInTheDocument()
  })

  it("salva o progresso no localStorage e navega para /mission ao terminar", async () => {
    renderLesson()

    // 1. Entendi
    fireEvent.click(screen.getByRole("button", { name: /entendi, vamos lá!/i }))

    // Q1: Correta (B)
    fireEvent.click(screen.getByText("Prevendo a próxima palavra mais provável de acordo com o contexto estatístico fornecido."))
    fireEvent.click(screen.getByRole("button", { name: /confirmar resposta/i }))
    fireEvent.click(screen.getByRole("button", { name: /^Próxima →$/ }))

    // Q2: Correta (C)
    fireEvent.click(screen.getByText("A precisão, clareza e estrutura do prompt enviado."))
    fireEvent.click(screen.getByRole("button", { name: /confirmar resposta/i }))

    // Finalizar lição
    fireEvent.click(screen.getByRole("button", { name: /ver resultado/i }))

    // Deve salvar no localStorage e ir para a página de missão concluída
    await waitFor(() => {
      expect(screen.getByText("Mission Completed Page")).toBeInTheDocument()
    })
    expect(screen.getByText("+1 Vida")).toBeInTheDocument()

    expect(saveProgress).toHaveBeenCalledWith(
      "user-1",
      "trending-skills",
      expect.objectContaining({
        completedLessonIds: expect.arrayContaining(["ts-mod-1-l1"]),
      })
    )
  })

  it("nao salva progresso quando o aluno erra alguma questao", async () => {
    renderLesson()

    fireEvent.click(screen.getByRole("button", { name: /entendi, vamos lá/i }))

    fireEvent.click(screen.getByText("Procurando respostas pré-programadas em um banco de dados estático."))
    fireEvent.click(screen.getByRole("button", { name: /confirmar resposta/i }))
    fireEvent.click(screen.getByRole("button", { name: /^Próxima →$/ }))

    fireEvent.click(screen.getByText("A precisão, clareza e estrutura do prompt enviado."))
    fireEvent.click(screen.getByRole("button", { name: /confirmar resposta/i }))
    fireEvent.click(screen.getByRole("button", { name: /ver resultado/i }))

    await waitFor(() => {
      expect(sileo.error).toHaveBeenCalledWith({
        title: "Atividade não concluída",
        description: "Acerte todas as questões para marcar a lição como concluída.",
      })
    })

    expect(saveProgress).not.toHaveBeenCalled()
    expect(screen.queryByText("Mission Completed Page")).not.toBeInTheDocument()
    expect(screen.getByText("Questão 1 de 2")).toBeInTheDocument()
  })
})
