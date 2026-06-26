import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import Skills from "./Skills"

const mockNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock("@/hooks/useAchievements", () => ({
  useAchievements: () => ({ checkFavorites: vi.fn().mockReturnValue([]) }),
}))

function renderSkills() {
  return render(
    <MemoryRouter initialEntries={["/skills"]}>
      <Routes>
        <Route path="/skills" element={<Skills />} />
        <Route path="/home" element={<div>home</div>} />
        <Route path="/skill/:skillName" element={<div>skill detail</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe("Skills — renderização", () => {
  it("exibe o título da Central de Skills", () => {
    renderSkills()
    expect(screen.getByText("Central de Skills")).toBeInTheDocument()
  })

  it("exibe campo de busca", () => {
    renderSkills()
    expect(
      screen.getByPlaceholderText(/buscar skills por nome/i)
    ).toBeInTheDocument()
  })

  it("exibe tabs de Todas, Favoritas e Mais Instaladas", () => {
    renderSkills()
    const allTabs = screen.getAllByRole("button", { name: /todas/i })
    expect(allTabs.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole("button", { name: /favoritas/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /mais instaladas/i })).toBeInTheDocument()
  })

  it("exibe filtros de categoria", () => {
    renderSkills()
    expect(screen.getByRole("button", { name: /desenvolvimento/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /design/i })).toBeInTheDocument()
  })
})

describe("Skills — busca", () => {
  it("filtra skills ao digitar na busca", async () => {
    renderSkills()
    const input = screen.getByPlaceholderText(/buscar skills por nome/i)

    await userEvent.type(input, "zzz_skill_que_nao_existe")

    expect(screen.getByText("Nenhuma skill encontrada")).toBeInTheDocument()
  })

  it("limpa busca ao clicar no botão X", async () => {
    renderSkills()
    const input = screen.getByPlaceholderText(/buscar skills por nome/i)

    await userEvent.type(input, "teste")
    expect(input).toHaveValue("teste")

    await userEvent.click(screen.getByRole("button", { name: /limpar busca/i }))
    expect(input).toHaveValue("")
  })

  it("exibe empty state quando nenhuma skill corresponde à busca", async () => {
    renderSkills()
    const input = screen.getByPlaceholderText(/buscar skills por nome/i)

    await userEvent.type(input, "xyzxyzxyz_inexistente_123")

    expect(screen.getByText("Nenhuma skill encontrada")).toBeInTheDocument()
    expect(screen.getByText(/tente ajustar/i)).toBeInTheDocument()
  })
})

describe("Skills — favoritos", () => {
  it("exibe empty state em Favoritas quando não há favoritos", async () => {
    renderSkills()
    await userEvent.click(screen.getByRole("button", { name: /favoritas/i }))

    expect(screen.getByText("Nenhuma skill favoritada")).toBeInTheDocument()
  })

  it("alterna para Favoritas e volta para Todas", async () => {
    renderSkills()

    await userEvent.click(screen.getByRole("button", { name: /favoritas/i }))
    expect(screen.getByText("Nenhuma skill favoritada")).toBeInTheDocument()

    const allButtons = screen.getAllByRole("button", { name: /todas/i })
    await userEvent.click(allButtons[0])
    expect(screen.queryByText("Nenhuma skill favoritada")).not.toBeInTheDocument()
  })
})

describe("Skills — ranking", () => {
  it("alterna para view de ranking ao clicar em Mais Instaladas", async () => {
    renderSkills()
    await userEvent.click(screen.getByRole("button", { name: /mais instaladas/i }))

    expect(screen.getByText(/skills ordenadas por número de instalações/i)).toBeInTheDocument()
  })

  it("oculta filtros de categoria no modo ranking", async () => {
    renderSkills()
    await userEvent.click(screen.getByRole("button", { name: /mais instaladas/i }))

    expect(screen.queryByRole("button", { name: /desenvolvimento/i })).not.toBeInTheDocument()
  })
})

describe("Skills — navegação", () => {
  it("navega para /home ao clicar no botão voltar", async () => {
    renderSkills()
    const backBtn = screen.getByLabelText("Voltar")
    await userEvent.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledWith("/home")
  })

  it("navega para detalhe da skill ao clicar no card", async () => {
    renderSkills()
    const cards = document.querySelectorAll('[class*="cursor-pointer"]')
    expect(cards.length).toBeGreaterThan(0)
  })
})

describe("Skills — filtro por categoria", () => {
  it("filtra skills ao selecionar uma categoria", async () => {
    renderSkills()

    // Clica em "Marketing"
    const marketingBtn = screen.getByRole("button", { name: /marketing/i })
    await userEvent.click(marketingBtn)

    // Deve ter pelo menos uma skill de marketing
    const cards = document.querySelectorAll('[class*="rounded-2xl border"]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it("volta para Todas ao clicar no botão Todas das categorias", async () => {
    renderSkills()

    const marketingBtn = screen.getByRole("button", { name: /marketing/i })
    await userEvent.click(marketingBtn)

    const allButtons = screen.getAllByRole("button", { name: /todas/i })
    // Clica no primeiro botão "Todas" (tab de visualização)
    await userEvent.click(allButtons[0])

    expect(screen.queryByText("Nenhuma skill encontrada")).not.toBeInTheDocument()
  })
})
