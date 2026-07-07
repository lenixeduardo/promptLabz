import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { WelcomeBackScreen } from "@/components/WelcomeBackScreen"

describe("WelcomeBackScreen", () => {
  it("renders nothing when inactive", () => {
    render(<WelcomeBackScreen active={false} onClose={() => {}} />)
    expect(screen.queryByText(/bom estar de volta/i)).not.toBeInTheDocument()
  })

  it("greets the user by first name when active", () => {
    render(<WelcomeBackScreen active name="Eduardo" onClose={() => {}} />)
    expect(screen.getByText("É você, Eduardo?! Que alegria!")).toBeInTheDocument()
  })

  it("falls back to a generic greeting without a name", () => {
    render(<WelcomeBackScreen active onClose={() => {}} />)
    expect(screen.getByText("Que alegria ter você de volta!")).toBeInTheDocument()
  })

  it("calls onClose when the CTA button is clicked", () => {
    const onClose = vi.fn()
    render(<WelcomeBackScreen active name="Eduardo" onClose={onClose} />)
    fireEvent.click(screen.getByRole("button", { name: /bom estar de volta/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
