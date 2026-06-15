import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Bell, ArrowRight, ExternalLink,
  TrendingUp, Users, BarChart3, Zap,
  type LucideIcon,
} from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { cn } from "@/lib/utils"
import { TEMPLATES, type Template } from "@/data/templatesData"

type Tab = "inicio" | "pagina-web" | "prompt" | "resultado"

const TABS: { key: Tab; label: string }[] = [
  { key: "inicio", label: "Início" },
  { key: "pagina-web", label: "Página Web" },
  { key: "prompt", label: "Prompt" },
  { key: "resultado", label: "Resultado" },
]

const STAT_ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Users, BarChart3, Zap,
}

function MiniDashboardPreview() {
  return (
    <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-white/30 bg-white/20 p-2 backdrop-blur-sm">
      <div className="mb-1.5 h-2 w-16 rounded-full bg-white/60" />
      <div className="mb-2 h-1.5 w-24 rounded-full bg-white/40" />
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-lg bg-white/30 p-1.5">
          <div className="mb-1 h-1 w-full rounded-full bg-white/60" />
          <div className="h-3 w-full rounded-sm bg-white/40" />
        </div>
        <div className="flex-1 rounded-lg bg-white/30 p-1.5">
          <div className="mb-1 h-1 w-full rounded-full bg-white/60" />
          <div className="h-3 w-full rounded-sm bg-white/40" />
        </div>
      </div>
      <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/50" />
    </div>
  )
}

function TabContent({ tab, template }: { tab: Tab; template: Template }) {
  if (tab === "pagina-web") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Estrutura da Página
          </p>
          {["Hero Section", "Benefícios", "Como Funciona", "Depoimentos", "Preços", "FAQ", "CTA Final"].map(
            (section) => (
              <div
                key={section}
                className="flex items-center gap-3 border-b border-[#E8F5EE] py-2.5 last:border-0"
              >
                <div className="h-2 w-2 rounded-full bg-[#2B5D3A]" />
                <span className="text-sm text-[#1F2A24]">{section}</span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  if (tab === "prompt") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
            Prompt do Template
          </p>
          <div className="rounded-xl bg-[#F5FBF7] p-3">
            <p className="text-xs leading-relaxed text-[#3A4B40]">
              Você é um especialista em copywriting para SaaS. Crie uma landing page completa para
              [PRODUTO], focada em conversão para [PÚBLICO-ALVO]. Inclua headline, benefícios, prova
              social e CTA persuasivo. Tom: [FORMAL/CASUAL].
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (tab === "resultado") {
    return (
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7EF]">
            <span className="text-2xl font-extrabold text-[#2B5D3A]">92</span>
          </div>
          <p className="text-sm font-bold text-[#1F2A24]">Excelente resultado!</p>
          <p className="mt-1 text-xs text-[#6B9E7E]">
            Este template gera copy de alta qualidade consistentemente.
          </p>
        </div>
      </div>
    )
  }

  // inicio (default)
  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="rounded-2xl border border-[#CDEAD8] bg-white p-4 shadow-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
          Sobre o template
        </p>
        <p className="text-sm leading-relaxed text-[#3A4B40]">{template.about}</p>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B9E7E]">
          Categorias
        </p>
        <div className="flex flex-wrap gap-2">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#BFE3CC] bg-[#EAF7EF] px-3 py-1 text-xs font-semibold text-[#2B5D3A]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TemplateDetail() {
  const navigate = useNavigate()
  const { templateId } = useParams<{ templateId: string }>()
  const [activeTab, setActiveTab] = useState<Tab>("inicio")

  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]

  return (
    <div className="min-h-screen bg-[#F0FAF3] pb-32">
      {/* Top header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E5F5EB] bg-white px-4 pt-10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CDEAD8] bg-[#F0FAF3] transition-all active:scale-95"
            aria-label="Voltar"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180 text-[#2B5D3A]" />
          </button>
          <span className="text-base font-extrabold text-[#2B5D3A]">Prompt Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#CDEAD8] bg-[#F0FAF3]"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4 text-[#2B5D3A]" strokeWidth={1.8} />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3E8E5E] to-[#2B5D3A]" />
        </div>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-[#E5F5EB] bg-white px-4 pb-0">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors",
              activeTab === key
                ? "border-[#2B5D3A] text-[#2B5D3A]"
                : "border-transparent text-[#8AB89A] hover:text-[#2B5D3A]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2B5D3A] via-[#3E8E5E] to-[#46996a] px-5 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-extrabold leading-tight text-white">
              {template.headline}
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-white/80">
              {template.subheadline}
            </p>
            {/* Stats */}
            <div className="mt-4 flex gap-4">
              {template.stats.map(({ icon, value, label }) => {
                const StatIcon = STAT_ICON_MAP[icon] ?? TrendingUp
                return (
                  <div key={label} className="flex items-center gap-1.5">
                    <StatIcon className="h-4 w-4 text-white/70" strokeWidth={1.8} />
                    <div>
                      <span className="text-sm font-extrabold text-white">{value}</span>
                      <span className="ml-1 text-xs text-white/70">{label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <MiniDashboardPreview />
        </div>
      </div>

      {/* Tab content */}
      <TabContent tab={activeTab} template={template} />

      {/* Fixed bottom actions */}
      <div className="fixed bottom-[72px] left-0 right-0 z-30 border-t border-[#E5F5EB] bg-white px-4 py-3">
        <div className="mx-auto flex max-w-[460px] gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2B5D3A] py-3 text-sm font-semibold text-[#2B5D3A] transition-all active:scale-95 hover:bg-[#EAF7EF]">
            <ExternalLink className="h-4 w-4" />
            Visualizar ao vivo
          </button>
          <button
            onClick={() => navigate(`/prompt/${template.promptId}`)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2B5D3A] py-3 text-sm font-semibold text-white transition-all active:scale-95 hover:bg-[#3E8E5E]"
          >
            Usar este template
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <BottomNav active="lab" />
    </div>
  )
}
