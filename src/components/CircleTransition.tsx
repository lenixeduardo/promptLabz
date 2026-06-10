import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface CircleTransitionProps {
  /** Target route to navigate to after the animation */
  to: string
  /** Trigger the transition */
  active: boolean
  /** Color of the expanding circle (default: primary green) */
  color?: string
}

/**
 * Full-screen overlay that plays a growing-circle reveal animation,
 * navigates to `to`, then plays a shrinking reveal on the next page.
 * Trigger by setting `active` to true.
 */
export function CircleTransition({ to, active, color = "#2B5D3A" }: CircleTransitionProps) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<"idle" | "grow" | "visible" | "shrink">("idle")

  useEffect(() => {
    if (!active) return
    setPhase("grow")

    // After circle covers the screen, navigate and start shrink
    const t1 = setTimeout(() => {
      navigate(to, { state: { circleReveal: true } })
    }, 620)

    return () => clearTimeout(t1)
  }, [active])

  if (phase === "idle") return null

  return (
    <div
      className={phase === "grow" ? "animate-circle-grow" : ""}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: color,
        clipPath: phase === "grow" ? undefined : "circle(150% at 50% 60%)",
        pointerEvents: "all",
      }}
    />
  )
}

/**
 * Wrap the entry of a page that receives a circle-reveal transition.
 * Plays the shrink animation on mount when navigated via CircleTransition.
 */
export function CircleRevealEntry({ color = "#2B5D3A" }: { color?: string }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 600)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  return (
    <div
      className="animate-circle-shrink"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: color,
        pointerEvents: "none",
      }}
    />
  )
}
