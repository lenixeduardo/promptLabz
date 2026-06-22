import { useParams } from "react-router-dom"
import { TEMPLATES, type Template } from "@/data/templatesData"

function WebPreview({ template }: { template: Template }) {
  const accent = template.previewColor
  return (
    <div className="min-h-screen" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: `${accent}30` }}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded" style={{ background: accent }} />
          <span className="font-bold text-gray-800">{template.name}</span>
        </div>
        <div className="flex gap-6">
          {["Início", "Funcionalidades", "Preços", "Blog"].map((item) => (
            <span key={item} className="text-sm text-gray-500 cursor-pointer hover:text-gray-800">{item}</span>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700">Entrar</button>
          <button className="px-4 py-2 text-sm rounded-lg text-white font-semibold" style={{ background: accent }}>Começar grátis</button>
        </div>
      </div>
      {/* Hero */}
      <div className="px-8 py-20 text-center" style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}05)` }}>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ background: accent }}>
          ✦ Novo • Template PromptLabz
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 max-w-3xl mx-auto leading-tight">{template.headline}</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">{template.subheadline}</p>
        <div className="flex justify-center gap-3">
          <button className="px-8 py-3 rounded-xl text-white font-bold text-base" style={{ background: accent }}>Usar este template</button>
          <button className="px-8 py-3 rounded-xl border-2 font-bold text-base text-gray-700" style={{ borderColor: `${accent}60` }}>Ver demo</button>
        </div>
      </div>
      {/* Sections grid */}
      <div className="px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">O que está incluído</h2>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {template.webSections.map((section) => (
            <div key={section} className="rounded-2xl p-5 border" style={{ borderColor: `${accent}30`, background: `${accent}08` }}>
              <div className="h-8 w-8 rounded-lg mb-3 flex items-center justify-center text-white text-sm font-bold" style={{ background: accent }}>
                {section.charAt(0)}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{section}</p>
              <p className="text-xs text-gray-500 mt-1">Seção otimizada e pronta para uso.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardPreview({ template }: { template: Template }) {
  const accent = template.previewColor
  const metrics = [
    { label: "Receita Total", value: "R$ 48.900", change: "+12%" },
    { label: "Despesas", value: "R$ 23.400", change: "-3%" },
    { label: "Saldo Líquido", value: "R$ 25.500", change: "+18%" },
    { label: "Investimentos", value: "R$ 12.200", change: "+7%" },
  ]
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-56 border-r border-gray-200 bg-white p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-6 px-2 pt-2">
            <div className="h-7 w-7 rounded-lg" style={{ background: accent }} />
            <span className="font-bold text-gray-800 text-sm">{template.name}</span>
          </div>
          {template.webSections.map((section) => (
            <button key={section} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 font-medium first:bg-gray-100 first:text-gray-900">
              {section}
            </button>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{template.headline}</h1>
            <p className="text-gray-500 text-sm mt-1">{template.subheadline}</p>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                <p className="text-xl font-bold text-gray-900">{m.value}</p>
                <span className="text-xs font-semibold" style={{ color: m.change.startsWith("+") ? "#16a34a" : "#dc2626" }}>{m.change}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-800 mb-4 text-sm">Evolução Mensal</p>
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 50, 80, 60, 90, 70, 85, 75, 95, 88, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 11 ? accent : `${accent}60` }} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
              <p className="font-semibold text-gray-800 mb-3 text-sm">Distribuição</p>
              <div className="space-y-2">
                {["Receitas", "Despesas", "Investimentos"].map((l, i) => (
                  <div key={l}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1"><span>{l}</span><span>{[52, 25, 23][i]}%</span></div>
                    <div className="h-2 rounded-full bg-gray-100"><div className="h-2 rounded-full" style={{ width: `${[52, 25, 23][i]}%`, background: accent, opacity: 1 - i * 0.25 }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlannerPreview({ template }: { template: Template }) {
  const accent = template.previewColor
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  const tasks = [
    { title: "Reunião de alinhamento", done: true, priority: "alta" },
    { title: "Revisar relatório mensal", done: true, priority: "alta" },
    { title: "Responder e-mails pendentes", done: false, priority: "média" },
    { title: "Planejamento da próxima sprint", done: false, priority: "alta" },
    { title: "Atualizar documentação", done: false, priority: "baixa" },
  ]
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{template.headline}</h1>
          <p className="text-gray-500 mt-1">{template.subheadline}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{ label: "Tarefas hoje", value: "8" }, { label: "Concluídas", value: "5" }, { label: "Hábitos", value: "3/5" }].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
              <p className="text-3xl font-bold" style={{ color: accent }}>{m.value}</p>
              <p className="text-xs text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Week view */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <p className="font-semibold text-gray-800 mb-4 text-sm">Visão da Semana</p>
            <div className="grid grid-cols-5 gap-2">
              {days.map((d, i) => (
                <div key={d} className="text-center">
                  <p className="text-[10px] text-gray-400 mb-1">{d.slice(0, 3)}</p>
                  <div className={`h-10 rounded-xl flex items-center justify-center text-xs font-bold ${i === 2 ? "text-white" : "text-gray-500 bg-gray-50 border border-gray-200"}`}
                    style={i === 2 ? { background: accent } : {}}>
                    {i + 9}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Task list */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <p className="font-semibold text-gray-800 mb-4 text-sm">Tarefas do Dia</p>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.title} className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${t.done ? "border-transparent" : "border-gray-300"}`}
                    style={t.done ? { background: accent } : {}} />
                  <span className={`text-xs flex-1 ${t.done ? "line-through text-gray-400" : "text-gray-700"}`}>{t.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${t.priority === "alta" ? "bg-red-100 text-red-600" : t.priority === "média" ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-500"}`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportPreview({ template }: { template: Template }) {
  const accent = template.previewColor
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.headline}</h1>
              <p className="text-gray-500 text-sm mt-1">{template.subheadline}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Período</p>
              <p className="text-sm font-bold text-gray-700">Jun 2025</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[{ l: "Vendas Totais", v: "R$ 124.500", c: "+23%" }, { l: "Ticket Médio", v: "R$ 890", c: "+8%" }, { l: "Novos Clientes", v: "142", c: "+15%" }, { l: "Conversão", v: "3,4%", c: "+0,5pp" }].map((m) => (
              <div key={m.l} className="rounded-xl p-4 text-center" style={{ background: `${accent}10` }}>
                <p className="text-xs text-gray-500 mb-1">{m.l}</p>
                <p className="text-xl font-bold text-gray-900">{m.v}</p>
                <span className="text-xs font-bold text-green-600">{m.c}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-3">Performance Mensal</p>
              <div className="flex items-end gap-1.5 h-28">
                {[55, 70, 60, 85, 65, 90, 75, 88, 80, 95, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? accent : `${accent}50` }} />
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm mb-3">Top Seções</p>
              <div className="space-y-2">
                {template.webSections.slice(0, 5).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5 text-gray-400">{i + 1}</span>
                    <div className="flex-1 h-5 rounded bg-gray-100 relative overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${90 - i * 12}%`, background: `${accent}${i === 0 ? "cc" : "80"}` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-24 truncate">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatePreview() {
  const { templateId } = useParams<{ templateId: string }>()
  const template = TEMPLATES.find((t) => t.id === templateId)

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">Template não encontrado</p>
          <p className="text-sm text-gray-500 mt-2">Feche esta aba e tente novamente.</p>
        </div>
      </div>
    )
  }

  const isDashboard = template.category === "Dashboards"
  const isPlanner = template.category === "Planilhas"
  const isReport = template.category === "Relatorios"

  return (
    <div>
      {/* Preview watermark bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-2 text-white text-xs font-semibold shadow-md" style={{ background: template.previewColor }}>
        <span>Pré-visualização · {template.name}</span>
        <div className="flex items-center gap-4">
          <span className="opacity-70">Este é um preview de demonstração</span>
          <button
            onClick={() => window.close()}
            className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            Fechar preview
          </button>
        </div>
      </div>

      {isDashboard ? (
        <DashboardPreview template={template} />
      ) : isPlanner ? (
        <PlannerPreview template={template} />
      ) : isReport ? (
        <ReportPreview template={template} />
      ) : (
        <WebPreview template={template} />
      )}
    </div>
  )
}
