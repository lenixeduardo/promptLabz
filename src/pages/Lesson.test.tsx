import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Lesson from "./Lesson"

vi.mock("@/lib/moduleProgress", () => ({
  advanceModule: vi.fn(),
  useModuleProgress: vi.fn().mockReturnValue(0),
}))

vi.mock("@/lib/userScope", () => ({
  scopedKey: (k: string) => `${k}::u:user-1`,
  USER_SCOPE_EVENT: "promptlabz:user-scope-change",
  initUserScope: vi.fn(),
  getUserId: vi.fn().mockReturnValue("user-1"),
}))

// DEFAULT_QUESTIONS for a1, module 0: 3 questions
// q1 correct = "b", q2 correct = "b", q3 correct = "b"
const Q1_PROMPT = "Qual desses prompts daria o melhor resultado?"
const Q1_OPT_B = "Atue como copywriter sênior e escreva um anúncio de Instagram"

function renderLesson(url = "/lesson?track=a1&module=0") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/learn" element={<div>Learning Lab Page</div>} />
        <Route path="/module-exam" element={<div>Module Exam Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("Lesson — fluxo de aprendizado", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("exibe a primeira pergunta e a barra de progresso", () => {
    renderLesson()
    expect(screen.getByText(/Pergunta 1 de/i)).toBeInTheDocument()
    expect(screen.getByText(Q1_PROMPT)).toBeInTheDocument()
  })

  it("exibe o botão desabilitado antes de selecionar uma opção", () => {
    renderLesson()
    expect(screen.getByText(/Selecione uma opção/i)).toBeInTheDocument()
  })

  it("mostra feedback positivo ao acertar a resposta", () => {
    renderLesson()
    // Click on option B (correct answer)
    const optionB = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes(Q1_OPT_B)
    )
    expect(optionB).toBeTruthy()
    fireEvent.click(optionB!)
    expect(screen.getByText(/Mandou bem!/i)).toBeInTheDocument()
  })

  it("mostra feedback negativo ao errar a resposta", () => {
    renderLesson()
    // Click on option A (wrong answer for q1)
    const optionA = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes("Escreva um texto sobre marketing")
    )
    expect(optionA).toBeTruthy()
    fireEvent.click(optionA!)
    expect(screen.getByText(/Quase lá!/i)).toBeInTheDocument()
  })

  it("exibe o botão 'Próxima pergunta' após responder", () => {
    renderLesson()
    const optionB = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes(Q1_OPT_B)
    )
    fireEvent.click(optionB!)
    expect(screen.getByRole("button", { name: /Próxima pergunta/i })).toBeInTheDocument()
  })

  it("avança para a próxima pergunta ao clicar em 'Próxima pergunta'", () => {
    renderLesson()
    // Answer q1
    const optionB = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes(Q1_OPT_B)
    )
    fireEvent.click(optionB!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))
    expect(screen.getByText(/Pergunta 2 de/i)).toBeInTheDocument()
  })

  it("exibe 'Ver resultado' na última pergunta", async () => {
    renderLesson()
    // q1: correct option B
    let btn = screen.getAllByRole("button").find(el => el.textContent?.includes(Q1_OPT_B))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))

    // q2: correct = b = "Aprendizado com poucos exemplos"
    btn = screen.getAllByRole("button").find(el => el.textContent?.includes("Aprendizado com poucos exemplos"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))

    // q3: last question — should show "Ver resultado"
    await waitFor(() => {
      expect(screen.getByText(/Pergunta 3 de/i)).toBeInTheDocument()
    })
    btn = screen.getAllByRole("button").find(el => el.textContent?.includes("Atribuição de papel"))
    fireEvent.click(btn!)
    expect(screen.getByRole("button", { name: /Ver resultado/i })).toBeInTheDocument()
  })

  it("exibe tela de resultado após completar todas as perguntas", async () => {
    renderLesson()
    // Answer all 3 questions correctly
    const answers = [
      Q1_OPT_B,
      "Aprendizado com poucos exemplos",
      "Atribuição de papel",
    ]
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getAllByRole("button").find(el => el.textContent?.includes(answers[i]))
      fireEvent.click(btn!)
      if (i < answers.length - 1) {
        fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))
      } else {
        fireEvent.click(screen.getByRole("button", { name: /Ver resultado/i }))
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Perfeito!/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/XP/i)).toBeInTheDocument()
  })

  it("exibe 'Boa tentativa!' ao errar alguma pergunta", async () => {
    renderLesson()
    // Answer q1 wrong (option A)
    const wrongBtn = screen.getAllByRole("button").find(el => el.textContent?.includes("Escreva um texto sobre marketing"))
    fireEvent.click(wrongBtn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))

    // Answer rest correctly
    let btn = screen.getAllByRole("button").find(el => el.textContent?.includes("Aprendizado com poucos exemplos"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima pergunta/i }))

    btn = screen.getAllByRole("button").find(el => el.textContent?.includes("Atribuição de papel"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Ver resultado/i }))

    await waitFor(() => {
      expect(screen.getByText(/Boa tentativa!/i)).toBeInTheDocument()
    })
  })
})
