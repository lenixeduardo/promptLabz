import { useState, useEffect } from "react"
import { AppBottomNav } from "@/components/AppBottomNav"
import {
  NEWS_ARTICLES,
  CATEGORY_COVER_IMAGES,
  type NewsArticle,
  type NewsCategory,
} from "@/data/newsData"
import { getNewsArticles, type DbNewsArticle } from "@/lib/db"
import { cn } from "@/lib/utils"

const CATEGORIES: Array<"Todos" | NewsCategory> = [
  "Todos", "OpenAI", "Anthropic", "Google", "ChatGPT", "Meta", "Microsoft", "General",
]

const CATEGORY_STYLES: Record<NewsCategory, string> = {
  OpenAI:    "bg-blue-50 text-blue-700 border border-blue-200",
  Anthropic: "bg-purple-50 text-purple-700 border border-purple-200",
  Google:    "bg-amber-50 text-amber-700 border border-amber-200",
  ChatGPT:   "bg-teal-50 text-teal-700 border border-teal-200",
  Meta:      "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Microsoft: "bg-sky-50 text-sky-700 border border-sky-200",
  General:   "bg-gray-50 text-gray-600 border border-gray-200",
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
    imageUrl: row.image_url ?? CATEGORY_COVER_IMAGES[row.category] ?? CATEGORY_COVER_IMAGES.General,
    sourceUrl: row.source_url ?? undefined,
  }
}

function NewsCard({ article }: { article: NewsArticle }) {
  const [imgError, setImgError] = useState(false)
  const coverSrc = imgError ? CATEGORY_COVER_IMAGES[article.category] : article.imageUrl

  const cardContent = (
    <div className="overflow-hidden rounded-2xl border border-stroke-muted bg-white">
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden bg-pageBgLight">
        <img
          src={coverSrc}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Category badge over image */}
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide backdrop-blur-sm",
            CATEGORY_STYLES[article.category],
          )}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-4">
        <p className="text-sm font-bold leading-snug text-foregroundDark line-clamp-2">
          {article.title}
        </p>
        <p className="line-clamp-2 text-xs leading-relaxed text-foregroundTertiary">
          {article.description}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-foregroundPlaceholder">{article.date}</span>
          {article.sourceUrl && (
            <span className="text-[10px] font-medium text-emerald-600">
              Ler artigo →
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (article.sourceUrl) {
    return (
      <a
        href={article.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label={article.title}
      >
        {cardContent}
      </a>
    )
  }

  return <div className="group">{cardContent}</div>
}

function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke-muted bg-white">
      <div className="h-44 w-full animate-pulse bg-stroke-muted/40" />
      <div className="flex flex-col gap-2 p-4">
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
                  : "border-stroke-light bg-white text-primary-dark hover:border-emerald",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => <NewsCardSkeleton key={i} />)}
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

      <AppBottomNav />
    </div>
  )
}
