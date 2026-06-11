import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuthContext } from "./AuthContext"

export const MAX_LIVES = 5
export const RECHARGE_MS = 60 * 60 * 1000 // 1 hour

interface Stored {
  lives: number
  lastRechargeTime: number   // timestamp of the last full-hour recharge tick
  lastPerfectDate: string | null  // "YYYY-MM-DD" – daily 100% bonus
}

function storageKey(userId: string) {
  return `pl:lives:${userId}`
}

// Advance lives by however many full hours have elapsed since lastRechargeTime
function applyPassiveRecharge(s: Stored): Stored {
  if (s.lives >= MAX_LIVES) return s
  const hours = Math.floor((Date.now() - s.lastRechargeTime) / RECHARGE_MS)
  if (hours === 0) return s
  return {
    ...s,
    lives: Math.min(s.lives + hours, MAX_LIVES),
    lastRechargeTime: s.lastRechargeTime + hours * RECHARGE_MS,
  }
}

interface LivesCtx {
  lives: number
  maxLives: number
  canPlay: boolean
  /** Returns ms until the next +1 passive recharge */
  msUntilNextLife: () => number
  consumeLife: () => void
  /** Call on lesson 100%. Returns true if a bonus life was actually granted (respects daily cap). */
  awardPerfectBonus: () => boolean
}

const Ctx = createContext<LivesCtx | undefined>(undefined)

export function LivesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()

  const [stored, setStored] = useState<Stored>({
    lives: MAX_LIVES,
    lastRechargeTime: Date.now(),
    lastPerfectDate: null,
  })

  // Keep a ref so callbacks can read current state without stale closure
  const ref = useRef(stored)
  useEffect(() => { ref.current = stored }, [stored])

  // Load from localStorage and apply any offline recharge
  useEffect(() => {
    if (!user) return
    const raw = localStorage.getItem(storageKey(user.id))
    const parsed: Stored = raw
      ? JSON.parse(raw)
      : { lives: MAX_LIVES, lastRechargeTime: Date.now(), lastPerfectDate: null }
    setStored(applyPassiveRecharge(parsed))
  }, [user])

  // Persist on every change
  useEffect(() => {
    if (!user) return
    localStorage.setItem(storageKey(user.id), JSON.stringify(stored))
  }, [user, stored])

  // Schedule a tick that fires exactly when the next life is ready
  useEffect(() => {
    if (stored.lives >= MAX_LIVES) return
    const msLeft = RECHARGE_MS - ((Date.now() - stored.lastRechargeTime) % RECHARGE_MS)
    const t = setTimeout(() => setStored(prev => applyPassiveRecharge(prev)), msLeft + 200)
    return () => clearTimeout(t)
  }, [stored.lives, stored.lastRechargeTime])

  const msUntilNextLife = useCallback((): number => {
    const s = ref.current
    if (s.lives >= MAX_LIVES) return 0
    return RECHARGE_MS - ((Date.now() - s.lastRechargeTime) % RECHARGE_MS)
  }, [])

  const consumeLife = useCallback(() => {
    setStored(prev => ({ ...prev, lives: Math.max(0, prev.lives - 1) }))
  }, [])

  const awardPerfectBonus = useCallback((): boolean => {
    const today = new Date().toISOString().slice(0, 10)
    const s = ref.current
    if (s.lastPerfectDate === today) return false
    setStored(prev => ({
      ...prev,
      lives: Math.min(prev.lives + 1, MAX_LIVES),
      lastPerfectDate: today,
    }))
    return true
  }, [])

  return (
    <Ctx.Provider value={{
      lives: stored.lives,
      maxLives: MAX_LIVES,
      canPlay: stored.lives > 0,
      msUntilNextLife,
      consumeLife,
      awardPerfectBonus,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLives() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useLives must be used inside <LivesProvider>")
  return ctx
}
