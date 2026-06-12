import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Sparkles,
  PawPrint,
  Lightbulb,
  GraduationCap,
  TrendingUp,
  Users,
  Pencil,
  ThumbsUp,
  BarChart3,
  LogOut,
  Loader2,
  BookOpen,
  Code2,
  Image,
  Server,
  Megaphone,
  ClipboardList,
  Workflow,
} from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useAchievements } from "@/hooks/useAchievements"
import { sileo } from "sileo"
import { PROMPTS } from "@/data/promptsData"
import { lessonsData } from "@/data/lessonsData"

const features = [
  { title: "Habilidades", icon: PawPrint, to: "/skills" },
  { title: "Biblioteca de Prompts", icon: Lightbulb, to: "/skills" },
  { title: "Laboratorio de Aprendizado", icon: GraduationCap, to: "/learn" },
]

const chips = [
  { label: "Habilidades em Alta", icon: TrendingUp, categoryKey: "trending-skills" },
  { label: "Desenvolvimento", icon: Code2, categoryKey: "desenvolvimento" },
  { label: "Design & UI", icon: Pencil, categoryKey: "design-ui" },
  { label: "IA & Media", icon: Image, categoryKey: "ia-media" },
  { label: "Cloud & Infra", icon: Server, categoryKey: "cloud-infra" },
  { label: "Marketing", icon: Megaphone, categoryKey: "marketing-digital" },
  { label: "Produtividade", icon: ClipboardList, categoryKey: "produtividade" },
  { label: "Agentes & Workflows", icon: Workflow, categoryKey: "agentes-workflows" },
  { label: "Comunidade", icon: Users, categoryKey: "community-hub" },
  { label: "Design", icon: Pencil, categoryKey: "design" },
  { label: "Ciencia de Prompts", icon: ThumbsUp, categoryKey: "prompt-science" },
  { label: "Engenharia de Prompts", icon: Lightbulb, categoryKey: "prompt-engineering" },
  { label: "Ciencia Avancada", icon: GraduationCap, categoryKey: "advanced-science" },
  { label: "Hora de Foco", icon: BarChart3, categoryKey: "hour-of-focus" },
]

export default function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const achievements = useAchievements()
  const [searchQuery, setSearchQuery] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Check daily streak + visit on mount
  const [streakChecked, setStreakChecked] = useState(false)
  if (!streakChecked) {
    const newAchs = achievements.checkDailyVisit()
    if (newAchs.length > 0 && import.meta.env.DEV) {
      console.log("[DEV] Novas conquistas desbloqueadas:", newAchs.map((a) => a.title))
    }
    setStreakChecked(true)
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      sileo.success({ title: "Até logo!" })
    } else {
      sileo.error({ title: result.error || "Erro ao sair" })
    }
  }

  // Optimize prompt draft client-side
  const handleOptimize = () => {
    if (!searchQuery.trim()) {
      sileo.error({ 
        title: "Escreva algo primeiro", 
        description: "Digite uma ideia de prompt na barra de busca para otimizar." 
      })
      return
    }

    setIsOptimizing(true)
    setTimeout(() => {
      const draft = searchQuery.trim()
      const optimized = `# PAPEL: Assistente Especialista de Inteligência Artificial
# CONTEXTO: Otimização de tarefa baseada na requisição do usuário.
# INSTRUÇÃO: Realize a seguinte ação com máxima precisão e clareza:
> "${draft}"

# FORMATO DA SAÍDA ESPERADA:
- Explicação direta do resultado em português.
- Formatação em tópicos limpos (Markdown).
- Exemplos de aplicação prática, se aplicável.`

      setSearchQuery(optimized)
      setIsOptimizing(false)
      sileo.success({ 
        title: "Prompt Otimizado! âœ¨", 
        description: "O prompt básico foi reestruturado com engenharia de prompts avançada." 
      })
    }, 1000)
  }

  // Search logic for prompts and lessons
  const searchResults = (() => {
    if (!searchQuery.trim()) return { prompts: [], lessons: [] }
    const query = searchQuery.toLowerCase()

    // Match prompts
    const matchedPrompts = PROMPTS.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).slice(0, 3)

    // Match lessons
    const matchedLessons: { 
      categoryKey: string
      categoryTitle: string
      moduleIndex: number
      lessonIndex: number
      lessonTitle: string 
    }[] = []

    Object.entries(lessonsData).forEach(([catKey, cat]) => {
      cat.modules.forEach((mod, modIdx) => {
        mod.lessons.forEach((les, lesIdx) => {
          if (
            les.title.toLowerCase().includes(query) || 
            mod.title.toLowerCase().includes(query) ||
            cat.title.toLowerCase().includes(query)
          ) {
            matchedLessons.push({
              categoryKey: catKey,
              categoryTitle: cat.title,
              moduleIndex: modIdx,
              lessonIndex: lesIdx,
              lessonTitle: les.title
            })
          }
        })
      })
    })

    return {
      prompts: matchedPrompts,
      lessons: matchedLessons.slice(0, 3)
    }
  })()

  const hasResults = searchResults.prompts.length > 0 || searchResults.lessons.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#EAF7EF] to-[#BFE6CF]">
      {/* Running cat mascot bleeding off the right edge */}
      <img
        src="/assets/mascot-home.png"
        alt="PromptLabz mascot"
        className="pointer-events-none absolute right-0 top-24 hidden h-80 w-auto object-contain lg:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-7">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <BrandLogo className="text-3xl" />
          <div className="flex items-center gap-3">
            <Link
              to="/avatars"
              className="flex items-center gap-2 rounded-full border border-[#BFE3CC] bg-white/70 px-3 py-1.5 shadow-sm hover:bg-[#F0FAF3] transition-colors"
            >
              <div className="h-8 w-8 overflow-hidden rounded-full border border-[#BFE3CC]">
                <img
                  src="/assets/avatar-cat.png"
                  alt="Account"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="hidden text-sm font-semibold text-[#2A3B30] sm:inline">
                {user?.email?.split("@")[0] || "Perfil"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded-full border border-red-200 bg-white/70 p-2 shadow-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Hero search wrapper */}
        <div className="mx-auto mt-12 w-full max-w-2xl relative">
          <div className="flex items-center gap-3 rounded-full border border-[#BFE3CC] bg-white px-6 py-4 shadow-md ring-4 ring-[#DCF1E4]">
            <Search className="h-6 w-6 text-primary" strokeWidth={2.2} />
            <input
              type="text"
              placeholder="Search skills, prompts, lessons…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg text-foreground placeholder:text-[#8A998F] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="rounded-full p-1 text-[#3E8E5E] hover:bg-[#F0FAF3] transition-colors disabled:opacity-50"
              title="Otimizar Prompt"
            >
              {isOptimizing ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#3E8E5E]" />
              ) : (
                <Sparkles className="h-6 w-6 text-[#3E8E5E]" strokeWidth={2.2} />
              )}
            </button>
          </div>

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div className="absolute top-[105%] left-0 right-0 z-30 max-h-[380px] overflow-y-auto rounded-3xl border border-[#CDEAD8] bg-white p-4 shadow-lg flex flex-col gap-4">
              {!hasResults ? (
                <div className="text-center py-6 text-sm text-[#6B7A70]">
                  Nenhum resultado encontrado para "{searchQuery}"
                </div>
              ) : (
                <>
                  {/* Matched Prompts */}
                  {searchResults.prompts.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E] mb-2 px-1">
                        Biblioteca de Prompts
                      </h3>
                      <div className="flex flex-col gap-2">
                        {searchResults.prompts.map((prompt) => (
                          <Link
                            key={prompt.title}
                            to="/skills"
                            className="flex items-center justify-between rounded-2xl border border-[#E1F2E7] bg-[#F9FCFA] px-4 py-2.5 hover:bg-[#EAF7EF] transition-colors"
                          >
                            <span className="text-sm font-semibold text-[#1F2A24]">{prompt.title}</span>
                            <span className="text-xs bg-[#DCF1E4] text-[#2E7A4E] px-2.5 py-0.5 rounded-full font-medium">
                              {prompt.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matched Lessons */}
                  {searchResults.lessons.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E] mb-2 px-1">
                        Lições e Conteúdos
                      </h3>
                      <div className="flex flex-col gap-2">
                        {searchResults.lessons.map((les) => (
                          <Link
                            key={les.lessonTitle}
                            to={`/lesson?category=${les.categoryKey}&moduleIndex=${les.moduleIndex}&lessonIndex=${les.lessonIndex}`}
                            className="flex items-center gap-2.5 rounded-2xl border border-[#E1F2E7] bg-[#F9FCFA] px-4 py-2.5 hover:bg-[#EAF7EF] transition-colors text-left"
                          >
                            <BookOpen className="h-4 w-4 text-[#3E8E5E] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#1F2A24] truncate">{les.lessonTitle}</p>
                              <p className="text-[10px] text-[#6B7A70]">{les.categoryTitle}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map(({ title, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="flex flex-col items-center gap-5 rounded-3xl border border-[#BFE3CC] bg-white/70 px-6 py-8 text-center shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md relative"
            >
              <span className="text-xl font-bold text-[#1F2A24]">{title}</span>
              <Icon className="h-12 w-12 text-[#3E8E5E]" strokeWidth={2} />
            </Link>
          ))}
        </div>

        {/* Continue Aprendendo */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#1F2A24]">Continue Aprendendo</h2>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {chips.map(({ label, icon: Icon, categoryKey }) => {
              return (
                <Link
                  key={label}
                  to={`/learn?category=${categoryKey}`}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border border-[#CDEAD8] bg-white px-4 py-2.5",
                    "text-sm font-medium text-[#2A3B30] shadow-sm transition-colors hover:bg-[#F0FAF3]"
                  )}
                >
                  <Icon className="h-4 w-4 text-[#3E8E5E]" strokeWidth={2.2} />
                  {label}
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

