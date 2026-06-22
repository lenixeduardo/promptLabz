import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { NEWS_ARTICLES } from "@/data/newsData"
import News from "./News"

vi.mock("@/components/AppBottomNav", () => ({
  AppBottomNav: () => <div data-testid="bottom-nav">Bottom Nav</div>,
}))

vi.mock("@/lib/db", () => ({
  getNewsArticles: vi.fn().mockResolvedValue({ data: null, error: null }),
}))

function renderNews() {
  return render(
    <MemoryRouter>
      <News />
    </MemoryRouter>
  )
}

describe("News - detalhe da noticia", () => {
  it("abre o conteudo completo ao clicar em uma noticia e permite fechar", async () => {
    const user = userEvent.setup()
    const article = NEWS_ARTICLES[0]

    renderNews()
    await user.click(await screen.findByRole("button", { name: article.title }))

    const dialog = screen.getByRole("dialog", { name: article.title })
    expect(within(dialog).getByText(article.description)).toBeInTheDocument()

    await user.click(within(dialog).getByRole("button", { name: "Fechar noticia" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
