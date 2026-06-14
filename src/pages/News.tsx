import { useState } from "react"
import { BottomNav } from "@/components/BottomNav"
import { NEWS_ARTICLES, type NewsArticle, type NewsCategory } from "@/data/newsData"
import { cn } from "@/lib/utils"

const CATEGORIES: Array<"Todos" | NewsCategory> = ["Todos", "OpenAI", "Anthropic", "Google", "ChatGPT"]

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  OpenAI:    "bg-blue-50 text-blue-700 border border-blue-200",
  Anthropic: "bg-purple-50 text-purple-700 border border-purple-200",
  Google:    "bg-amber-50 text-amber-700 border border-amber-200",
  ChatGPT:   "bg-teal-50 text-teal-700 border border-teal-200",
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#CDEAD8] bg-white p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EF] text-3xl">
        {article.imageEmoji}
      </div>
      <div className="flex flex-1 flex-col">
        <span
          className={cn(
            "w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            CATEGORY_STYLES[article.category]
          )}
        >
          {article.category}
        </span>
        <p className="mt-1 text-sm font-bold leading-snug text-[#1F2A24]">
          {article.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6B7A70]">
          {article.description}
        </p>
        <span className="mt-2 text-[10px] text-[#8A998F]">{article.date}</span>
      </div>
    </div>
  )
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState<"Todos" | NewsCategory>("Todos")

  const filtered =
    activeCategory === "Todos"
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter((a) => a.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#EAF7EF] to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#CDEAD8] bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-[#2B5D3A]">Notícias</h1>
        <p className="text-xs text-[#6B7A70]">
          Fique por dentro do mundo de AI e Prompt Engineering
        </p>
      </div>

      {/* Category filter chips */}
      <div className="no-scrollbar overflow-x-auto border-b border-[#CDEAD8] bg-white">
        <div className="flex gap-2 px-4 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === cat
                  ? "border-[#2B5D3A] bg-[#2B5D3A] text-white"
                  : "border-[#BFE3CC] bg-white text-[#2B5D3A] hover:border-[#3E8E5E]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles list */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-medium text-[#6B7A70]">Nenhuma notícia nessa categoria.</p>
          </div>
        ) : (
          filtered.map((article) => <NewsCard key={article.id} article={article} />)
        )}
      </div>

      <BottomNav active="home" />
    </div>
  )
}
