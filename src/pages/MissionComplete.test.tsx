import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import MissionComplete from "./MissionComplete"
import { LivesProvider } from "@/contexts/LivesContext"

const mockUser = { id: "user-1", email: "aluno@test.com" }

// Mock useAuthContext
vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: () => ({ user: mockUser, loading: false, error: null }),
}))

function renderMission(state?: { bonusAwarded?: boolean }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/mission", state }]}>
      <LivesProvider>
        <Routes>
          <Route path="/mission" element={<MissionComplete />} />
        </Routes>
      </LivesProvider>
    </MemoryRouter>
  )
}

describe("MissionComplete", () => {
  it("mostra recompensa de vida quando a atividade foi concluida corretamente", () => {
    renderMission({ bonusAwarded: true })

    expect(screen.getByText("+1 Vida")).toBeInTheDocument()
  })

  it("nao mostra recompensa de vida quando nao ha conclusao valida", () => {
    renderMission()

    expect(screen.queryByText("+1 Vida")).not.toBeInTheDocument()
  })
})
