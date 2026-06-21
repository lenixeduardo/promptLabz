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

// a1Boas_vindas for track=a1, module=0: 3 questions, all correct = "b"
const Q1_PROMPT = "O que é o PromptLabz?"
const Q1_OPT_B = "Uma trilha de aprendizado prática para você dominar a arte de escrever prompts"

function renderLesson(url = "/lesson?track=a1&module=0") {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/learn" element={"Learning Lab Page"} />
        <Route path="/module-exam" element={"Module Exam Page"} />
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
    expect(screen.getByText(/^\s*\d+\s+de\s+\d+\s*$/)).toBeInTheDocument()
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
    // Click on option A (wrong answer for q1 — a1bv0)
    const optionA = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes("Uma plataforma para treinar modelos de IA do zero")
    )
    expect(optionA).toBeTruthy()
    fireEvent.click(optionA!)
    expect(screen.getByText(/Quase lá!/i)).toBeInTheDocument()
  })

  it("exibe o botão 'Próxima atividade' após responder", () => {
    renderLesson()
    const optionB = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes(Q1_OPT_B)
    )
    fireEvent.click(optionB!)
    expect(screen.getByRole("button", { name: /Próxima atividade/i })).toBeInTheDocument()
  })

  it("avança para a próxima pergunta ao clicar em 'Próxima atividade'", () => {
    renderLesson()
    // Answer q1
    const optionB = screen.getAllByRole("button").find(
      (el) => el.textContent?.includes(Q1_OPT_B)
    )
    fireEvent.click(optionB!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))
    expect(screen.getByText(/^\s*2\s+de\s+3\s*$/)).toBeInTheDocument()
  })

  it("exibe tela de resultado após completar todas as perguntas", async () => {
    renderLesson()
    // Answer all 3 questions correctly (a1Boas_vindas — all correct = option "b")
    const answers = [
      Q1_OPT_B,
      "Escrever prompts claros, específicos e eficazes",
      "prompts bem escritos multiplicam sua produtividade",
    ]
    for (let i = 0; i < answers.length; i++) {
      const btn = screen.getAllByRole("button").find((el) => el.textContent?.includes(answers[i]))
      fireEvent.click(btn!)
      const nextBtn = screen.queryByRole("button", { name: /Próxima atividade/i })
      const finishBtn = screen.queryByRole("button", { name: /Ver resultado/i })
      if (i < answers.length - 1) {
        fireEvent.click(nextBtn!)
      } else if (finishBtn) {
        fireEvent.click(finishBtn)
      }
    }

    await waitFor(() => {
      expect(screen.getByText(/Perfeito!/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/XP/i)).toBeInTheDocument()
  })

  it("exibe 'Boa tentativa!' ao errar alguma pergunta", async () => {
    renderLesson()
    // Answer q1 wrong (option A — a1bv0)
    const wrongBtn = screen.getAllByRole("button").find((el) => el.textContent?.includes("Uma plataforma para treinar modelos de IA do zero"))
    fireEvent.click(wrongBtn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))

    // Answer rest correctly (a1bv1 and a1bv2)
    let btn = screen.getAllByRole("button").find((el) => el.textContent?.includes("Escrever prompts claros, específicos e eficazes"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Próxima atividade/i }))

    btn = screen.getAllByRole("button").find((el) => el.textContent?.includes("prompts bem escritos multiplicam sua produtividade"))
    fireEvent.click(btn!)
    fireEvent.click(screen.getByRole("button", { name: /Ver resultado/i }))

    await waitFor(() => {
      expect(screen.getByText(/Boa tentativa!/i)).toBeInTheDocument()
    })
  })
})
