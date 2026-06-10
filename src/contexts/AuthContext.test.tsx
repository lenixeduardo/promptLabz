import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { AuthProvider, useAuthContext } from "./AuthContext"

const { mockGetSession, mockOnAuthStateChange } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  },
}))

function TestConsumer() {
  const { user, loading, error } = useAuthContext()
  if (loading) return <div>carregando</div>
  if (error) return <div>{error}</div>
  return <div>{user ? `logado: ${user.email}` : "deslogado"}</div>
}

beforeEach(() => {
  mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
})

describe("AuthProvider", () => {
  it("exibe estado de carregamento inicial", () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    expect(screen.getByText("carregando")).toBeInTheDocument()
  })

  it("exibe usuário deslogado quando não há sessão", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText("deslogado")).toBeInTheDocument())
  })

  it("exibe usuário logado quando há sessão ativa", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { email: "user@test.com" } } },
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() =>
      expect(screen.getByText("logado: user@test.com")).toBeInTheDocument()
    )
  })

  it("lança erro ao usar useAuthContext fora do AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuthContext must be used within AuthProvider"
    )
    consoleSpy.mockRestore()
  })

  it("exibe erro quando getSession falha", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: { message: "Sessão inválida" },
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByText("Sessão inválida")).toBeInTheDocument())
  })
})
