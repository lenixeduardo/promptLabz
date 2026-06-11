import { createContext } from "react"

export interface LivesCtx {
  lives: number
  maxLives: number
  canPlay: boolean
  msUntilNextLife: () => number
  consumeLife: () => void
  awardPerfectBonus: () => boolean
}

export const LivesContext = createContext<LivesCtx | undefined>(undefined)
