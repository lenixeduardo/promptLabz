import { useContext } from "react"
import { LivesContext } from "./LivesState"

export function useLives() {
  const ctx = useContext(LivesContext)
  if (!ctx) throw new Error("useLives must be used inside <LivesProvider>")
  return ctx
}
