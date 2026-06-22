import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { AuthProvider, useAuthContext } from "./AuthContext"

type AuthChangeCallback = (event: string, session: { user: { email: string } } | null) => void

let capturedCallback: AuthChangeCallback | null = null

const { mockOnAuthStateChange } = vi.hoisted(() => ({
  mockOnAuthStateChange: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
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
  capturedCallback = null
  mockOnAuthStateChange.mockImplementation((cb: AuthChangeCallback) => {
    capturedCallback = cb
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  })
})

describe("AuthProvider", () => {
  it("exibe estado de carregamento inicial antes da sessão ser resolvida", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )
    // Before onAuthStateChange fires, loading is true
    expect(screen.getByText("carregando")).toBeInTheDocument()
  })

  it("exibe usuário deslogado quando não há sessão", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Simulate INITIAL_SESSION with no session
    capturedCallback!("INITIAL_SESSION", null)

    await waitFor(() => expect(screen.getByText("deslogado")).toBeInTheDocument())
  })

  it("exibe usuário logado quando há sessão ativa", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Simulate INITIAL_SESSION with an active session
    capturedCallback!("INITIAL_SESSION", { user: { email: "user@test.com" } } as any)

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

  it("atualiza o usuário quando o evento SIGNED_IN é disparado", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // First no session
    capturedCallback!("INITIAL_SESSION", null)
    await waitFor(() => expect(screen.getByText("deslogado")).toBeInTheDocument())

    // Then sign in
    capturedCallback!("SIGNED_IN", { user: { email: "novo@test.com" } } as any)
    await waitFor(() =>
      expect(screen.getByText("logado: novo@test.com")).toBeInTheDocument()
    )
  })
})
