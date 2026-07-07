import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import {
  getCompletedCount,
  advanceModule,
  syncModuleProgressFromServer,
  useModuleProgress,
} from "./moduleProgress"

// scopedKey("promptlabz:module-progress:v2") resolves to this for the mocked user below
const PROGRESS_KEY = "promptlabz:module-progress:v2::u:user-1"
const USER_SCOPE_EVENT = "promptlabz:user-scope-change"

let mockUserId: string | null = "user-1"

vi.mock("@/lib/userScope", () => ({
  scopedKey: (k: string) => `${k}::u:user-1`,
  USER_SCOPE_EVENT: "promptlabz:user-scope-change",
  getUserId: () => mockUserId,
}))

const mockSaveModuleProgress = vi.fn()
const mockFetchModuleProgress = vi.fn()

vi.mock("@/lib/db", () => ({
  saveModuleProgress: (...args: unknown[]) => mockSaveModuleProgress(...args),
  fetchModuleProgress: (...args: unknown[]) => mockFetchModuleProgress(...args),
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  mockUserId = "user-1"
  mockSaveModuleProgress.mockResolvedValue({ data: null, error: null })
  mockFetchModuleProgress.mockResolvedValue({ data: null, error: null })
})

// ── getCompletedCount ────────────────────────────────────────────────────────

describe("getCompletedCount", () => {
  it("retorna os padrões quando não há nada salvo (a1 pré-completa, a2/a3 zeradas)", () => {
    expect(getCompletedCount("a1")).toBe(7)
    expect(getCompletedCount("a2")).toBe(0)
    expect(getCompletedCount("a3")).toBe(0)
  })

  it("lê o valor salvo no localStorage quando existe", () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a1: 3 }))
    expect(getCompletedCount("a1")).toBe(3)
  })

  it("cai no padrão quando o JSON salvo é inválido", () => {
    localStorage.setItem(PROGRESS_KEY, "not-json")
    expect(getCompletedCount("a1")).toBe(7)
  })
})

// ── advanceModule ────────────────────────────────────────────────────────────

describe("advanceModule", () => {
  it("incrementa e persiste no localStorage", () => {
    advanceModule(10, "a2")
    expect(getCompletedCount("a2")).toBe(1)
  })

  it("não avança além do total", () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a2: 5 }))
    advanceModule(5, "a2")
    expect(getCompletedCount("a2")).toBe(5)
    expect(mockSaveModuleProgress).not.toHaveBeenCalled()
  })

  it("sincroniza a nova contagem com o Supabase quando há usuário logado", () => {
    advanceModule(10, "a2")
    expect(mockSaveModuleProgress).toHaveBeenCalledWith("user-1", "a2", 1)
  })

  it("não tenta sincronizar quando não há usuário logado", () => {
    mockUserId = null
    advanceModule(10, "a2")
    expect(mockSaveModuleProgress).not.toHaveBeenCalled()
  })

  it("mantém o avanço local mesmo se a sincronização falhar", async () => {
    mockSaveModuleProgress.mockRejectedValue(new Error("network error"))
    advanceModule(10, "a2")
    expect(getCompletedCount("a2")).toBe(1)
    // deixa a promise rejeitada (fire-and-forget) resolver sem lançar
    await Promise.resolve()
  })
})

// ── syncModuleProgressFromServer ──────────────────────────────────────────────

describe("syncModuleProgressFromServer", () => {
  it("aplica o progresso remoto quando ele é maior que o local", async () => {
    mockFetchModuleProgress.mockResolvedValue({ data: { a2: 5, a3: 2 }, error: null })

    await syncModuleProgressFromServer("user-1")

    expect(getCompletedCount("a2")).toBe(5)
    expect(getCompletedCount("a3")).toBe(2)
  })

  it("mantém o valor local quando ele é maior ou igual ao remoto", async () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a2: 8 }))
    mockFetchModuleProgress.mockResolvedValue({ data: { a2: 5 }, error: null })

    await syncModuleProgressFromServer("user-1")

    expect(getCompletedCount("a2")).toBe(8)
  })

  it("não escreve no localStorage quando não há dado remoto", async () => {
    mockFetchModuleProgress.mockResolvedValue({ data: null, error: "Erro" })

    await syncModuleProgressFromServer("user-1")

    expect(localStorage.getItem(PROGRESS_KEY)).toBeNull()
  })
})

// ── useModuleProgress ─────────────────────────────────────────────────────────

describe("useModuleProgress", () => {
  it("retorna a contagem atual da track", () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a1: 4 }))
    const { result } = renderHook(() => useModuleProgress("a1"))
    expect(result.current).toBe(4)
  })

  it("atualiza quando advanceModule dispara o evento de mudança", () => {
    const { result } = renderHook(() => useModuleProgress("a2"))
    expect(result.current).toBe(0)

    act(() => {
      advanceModule(10, "a2")
    })

    expect(result.current).toBe(1)
  })

  it("atualiza quando o escopo do usuário muda", () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a1: 2 }))
    const { result } = renderHook(() => useModuleProgress("a1"))
    expect(result.current).toBe(2)

    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ a1: 9 }))
    act(() => {
      window.dispatchEvent(new CustomEvent(USER_SCOPE_EVENT))
    })

    expect(result.current).toBe(9)
  })
})
