import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import MissionComplete from "./MissionComplete"

function renderMission(state?: { earnedHeart?: boolean }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/mission", state }]}>
      <Routes>
        <Route path="/mission" element={<MissionComplete />} />
      </Routes>
    </MemoryRouter>
  )
}

describe("MissionComplete", () => {
  it("mostra recompensa de vida quando a atividade foi concluida corretamente", () => {
    renderMission({ earnedHeart: true })

    expect(screen.getByText("+1 Vida")).toBeInTheDocument()
  })

  it("nao mostra recompensa de vida quando nao ha conclusao valida", () => {
    renderMission()

    expect(screen.queryByText("+1 Vida")).not.toBeInTheDocument()
  })
})
