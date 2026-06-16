import { useState, useEffect } from "react"
import { BottomNav } from "@/components/BottomNav"
import { NEWS_ARTICLES, type NewsArticle, type NewsCategory } from "@/data/newsData"
import { getNewsArticles, type DbNewsArticle } from "@/lib/db"
import { cn } from "@/lib/utils"

const CATEGORIES: Array<"Todos" | NewsCategory> = ["Todos", "OpenAI", "Anthropic", "Google", "ChatGPT"]

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  OpenAI:    "bg-blue-50 text-blue-700 border border-blue-200",
  Anthropic: "bg-purple-50 text-purple-700 border border-purple-200",
  Google:    "bg-amber-50 text-amber-700 border border-amber-200",
  ChatGPT:   "bg-teal-50 text-teal-700 border border-teal-200",
}

const PT_MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} ${PT_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function mapDbArticle(row: DbNewsArticle): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    date: formatDate(row.published_at),
    imageEmoji: row.image_emoji,
  }
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-stroke-muted bg-white p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-pageBgLight text-3xl">
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
        <p className="mt-1 text-sm font-bold leading-snug text-foregroundDark">
          {article.title}
        </p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foregroundTertiary">
          {article.description}
        </p>
        <span className="mt-2 text-[10px] text-foregroundPlaceholder">{article.date}</span>
      </div>
    </div>
  )
}

function NewsCardSkeleton() {
  return (
    <div className="flex gap-3 rounded-2xl border border-stroke-muted bg-white p-4">
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-stroke-muted/40" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-16 animate-pulse rounded-full bg-stroke-muted/40" />
        <div className="h-4 w-full animate-pulse rounded bg-stroke-muted/40" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-stroke-muted/30" />
      </div>
    </div>
  )
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState<"Todos" | NewsCategory>("Todos")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNewsArticles().then(({ data }) => {
      setArticles(data && data.length > 0 ? data.map(mapDbArticle) : NEWS_ARTICLES)
      setLoading(false)
    })
  }, [])

  const filtered =
    activeCategory === "Todos"
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pageBgLight to-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-stroke-muted bg-white px-4 py-3">
        <h1 className="text-xl font-bold text-primary-dark">Notícias</h1>
        <p className="text-xs text-foregroundTertiary">
          Fique por dentro do mundo de AI e Prompt Engineering
        </p>
      </div>

      {/* Category filter chips */}
      <div className="no-scrollbar overflow-x-auto border-b border-stroke-muted bg-white">
        <div className="flex gap-2 px-4 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                activeCategory === cat
                  ? "border-primary-dark bg-primary-dark text-white"
                  : "border-stroke-light bg-white text-primary-dark hover:border-emerald"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles list */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => <NewsCardSkeleton key={i} />)}
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-medium text-foregroundTertiary">Nenhuma notícia nessa categoria.</p>
          </div>
        ) : (
          filtered.map((article) => <NewsCard key={article.id} article={article} />)
        )}
      </div>

      <BottomNav active="home" />
    </div>
  )
}
