import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useFavorites } from "./useFavorites"

// scopedKey("promptlabz:favorite_skills") resolves to this when no user is logged in
const FAVORITES_KEY = "promptlabz:favorite_skills::u:anon"

beforeEach(() => {
  localStorage.clear()
})

describe("useFavorites — estado inicial", () => {
  it("começa com lista vazia quando localStorage está limpo", () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })

  it("carrega favoritos salvos do localStorage", () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["Skill A", "Skill B"]))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual(["Skill A", "Skill B"])
  })

  it("retorna lista vazia quando localStorage tem JSON inválido", () => {
    localStorage.setItem(FAVORITES_KEY, "not-json")
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })
})

describe("useFavorites — toggleFavorite", () => {
  it("adiciona skill aos favoritos quando não está favoritada", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => { result.current.toggleFavorite("Skill A") })

    expect(result.current.favorites).toContain("Skill A")
  })

  it("remove skill dos favoritos quando já está favoritada", () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["Skill A"]))
    const { result } = renderHook(() => useFavorites())

    act(() => { result.current.toggleFavorite("Skill A") })

    expect(result.current.favorites).not.toContain("Skill A")
  })

  it("persiste favoritos no localStorage após toggle", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => { result.current.toggleFavorite("Skill A") })

    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
    expect(stored).toContain("Skill A")
  })

  it("remove do localStorage quando desfavorita", () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["Skill A"]))
    const { result } = renderHook(() => useFavorites())

    act(() => { result.current.toggleFavorite("Skill A") })

    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
    expect(stored).not.toContain("Skill A")
  })

  it("pode favoritar múltiplas skills independentes", () => {
    const { result } = renderHook(() => useFavorites())

    act(() => { result.current.toggleFavorite("Skill A") })
    act(() => { result.current.toggleFavorite("Skill B") })

    expect(result.current.favorites).toHaveLength(2)
    expect(result.current.favorites).toContain("Skill A")
    expect(result.current.favorites).toContain("Skill B")
  })
})

describe("useFavorites — isFavorite", () => {
  it("retorna true para skill favoritada", () => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(["Skill A"]))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite("Skill A")).toBe(true)
  })

  it("retorna false para skill não favoritada", () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite("Skill X")).toBe(false)
  })

  it("atualiza isFavorite após toggle", () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.isFavorite("Skill A")).toBe(false)
    act(() => { result.current.toggleFavorite("Skill A") })
    expect(result.current.isFavorite("Skill A")).toBe(true)
    act(() => { result.current.toggleFavorite("Skill A") })
    expect(result.current.isFavorite("Skill A")).toBe(false)
  })
})
