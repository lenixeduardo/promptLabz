import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import AuthCallback from "./AuthCallback"

const mockExchangeCodeForSession = vi.fn()
const mockError = vi.fn()

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      exchangeCodeForSession: (...args: unknown[]) => mockExchangeCodeForSession(...args),
    },
  },
}))

vi.mock("sileo", () => ({
  sileo: {
    error: (...args: unknown[]) => mockError(...args),
  },
}))

function renderCallback(url = "/auth/callback?code=oauth-code") {
  window.history.replaceState({}, "", url)

  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe("AuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("troca code por sessao e redireciona para home", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })

    renderCallback()

    await waitFor(() => {
      expect(mockExchangeCodeForSession).toHaveBeenCalledWith("oauth-code")
      expect(screen.getByText("Home Page")).toBeInTheDocument()
    })
  })

  it("redireciona para login quando code nao existe", async () => {
    renderCallback("/auth/callback")

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument()
    })
  })

  it("redireciona para login quando troca de sessao falha", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: { message: "OAuth failed" } })

    renderCallback()

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith({ title: "OAuth failed" })
      expect(screen.getByText("Login Page")).toBeInTheDocument()
    })
  })
})
