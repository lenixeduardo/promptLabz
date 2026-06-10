import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"

vi.mock("@/contexts/AuthContext", () => ({
  useAuthContext: vi.fn(),
}))

import { useAuthContext } from "@/contexts/AuthContext"
const mockUseAuthContext = useAuthContext as ReturnType<typeof vi.fn>

function Protected() {
  return <div>área protegida</div>
}

function renderWithRouter(initialPath = "/protected") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>tela de login</div>} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <Protected />
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe("PrivateRoute", () => {
  it("exibe loading enquanto auth está carregando", () => {
    mockUseAuthContext.mockReturnValue({ user: null, loading: true })
    renderWithRouter()
    expect(screen.getByText("Carregando...")).toBeInTheDocument()
  })

  it("renderiza conteúdo protegido quando usuário está autenticado", () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: "1", email: "user@test.com" },
      loading: false,
    })
    renderWithRouter()
    expect(screen.getByText("área protegida")).toBeInTheDocument()
  })

  it("redireciona para /login quando usuário não está autenticado", () => {
    mockUseAuthContext.mockReturnValue({ user: null, loading: false })
    renderWithRouter()
    expect(screen.getByText("tela de login")).toBeInTheDocument()
    expect(screen.queryByText("área protegida")).not.toBeInTheDocument()
  })
})
