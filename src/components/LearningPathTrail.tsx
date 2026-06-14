import { Check, Lock, PenLine, type LucideIcon } from "lucide-react"

export interface TrailModule {
  id: string
  title: string
  status: "completed" | "current" | "locked"
  icon?: LucideIcon
}

interface LearningPathTrailProps {
  modules: TrailModule[]
  completedCount: number
  totalCount: number
}

export function LearningPathTrail({ modules, completedCount, totalCount }: LearningPathTrailProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-base font-bold text-[#1F2A24]">Sua Trilha de Aprendizado</h2>
          <p className="text-xs text-[#6B7A70] mt-0.5">
            {completedCount}/{totalCount} módulos concluídos
          </p>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-start gap-0 min-w-max pb-2">
          {modules.map((mod, idx) => {
            const isLast = idx === modules.length - 1
            const Icon = mod.status === "completed"
              ? Check
              : mod.status === "current"
              ? (mod.icon ?? PenLine)
              : Lock

            const nodeColor =
              mod.status === "completed"
                ? "bg-[#2B5D3A] border-[#2B5D3A]"
                : mod.status === "current"
                ? "bg-white border-[#2B5D3A]"
                : "bg-white border-[#C8D5CC]"

            const iconColor =
              mod.status === "completed"
                ? "text-white"
                : mod.status === "current"
                ? "text-[#2B5D3A]"
                : "text-[#A0AFA5]"

            const lineColor =
              mod.status === "completed" || (idx > 0 && modules[idx - 1]?.status === "completed")
                ? "bg-[#2B5D3A]"
                : "bg-[#C8D5CC]"

            return (
              <div key={mod.id} className="flex items-start">
                {/* Node + label */}
                <div className="flex flex-col items-center w-20">
                  <div
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center ${nodeColor}`}
                  >
                    <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2.5} />
                  </div>
                  <span
                    className={`text-[10px] text-center mt-1.5 leading-tight px-1 ${
                      mod.status === "current"
                        ? "font-bold text-[#1F2A24]"
                        : mod.status === "completed"
                        ? "font-medium text-[#3E8E5E]"
                        : "font-medium text-[#8A998F]"
                    }`}
                  >
                    {mod.title}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div className="flex items-center mt-[22px]">
                    <div className={`h-[2px] w-6 ${lineColor}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_TRAIL_MODULES: TrailModule[] = [
  { id: "fundamentos", title: "Fundamentos de Prompts", status: "completed", icon: Check },
  { id: "estrutura", title: "Estrutura de Prompts", status: "current", icon: PenLine },
  { id: "tecnicas", title: "Técnicas Avançadas", status: "locked", icon: Lock },
  { id: "agentes", title: "Agentes com IA", status: "locked", icon: Lock },
]
