export interface LabCategory {
  id: string
  label: string
  icon: string
  promptCount: number
  mascotIcon: string
}

export const LAB_CATEGORIES: LabCategory[] = [
  { id: "Criatividade",  label: "Criatividade",      icon: "Lightbulb",    promptCount: 12, mascotIcon: "/assets/mascot-icons/mascot_lightbulb.svg" },
  { id: "Marketing",    label: "Marketing",          icon: "Megaphone",    promptCount: 15, mascotIcon: "/assets/mascot-icons/mascot_rocket.svg"   },
  { id: "Programacao",  label: "Coding",             icon: "Code2",        promptCount: 18, mascotIcon: "/assets/mascot-icons/mascot_code.svg"     },
  { id: "Educacao",     label: "Educação",           icon: "Apple",        promptCount: 14, mascotIcon: "/assets/mascot-icons/mascot_book.svg"     },
  { id: "Produtividade",label: "Produtividade",      icon: "ClipboardList",promptCount: 16, mascotIcon: "/assets/mascot-icons/mascot_target.svg"   },
  { id: "Analise",      label: "Análise de Dados",   icon: "BarChart3",    promptCount: 12, mascotIcon: "/assets/mascot-icons/mascot_chart.svg"    },
  { id: "Comunicacao",  label: "Comunicação",        icon: "MessageSquare",promptCount: 15, mascotIcon: "/assets/mascot-icons/mascot_team.svg"     },
  { id: "Automacao",    label: "Automação",          icon: "Settings",     promptCount: 11, mascotIcon: "/assets/mascot-icons/mascot_brain.svg"    },
  { id: "Negocios",     label: "Negócios",           icon: "Briefcase",    promptCount: 13, mascotIcon: "/assets/mascot-icons/mascot_growth.svg"   },
  { id: "Design",       label: "Design",             icon: "Palette",      promptCount: 17, mascotIcon: "/assets/mascot-icons/mascot_palette.svg"  },
  { id: "Suporte",      label: "Suporte ao\nCliente",icon: "Headphones",   promptCount: 10, mascotIcon: "/assets/mascot-icons/mascot_heart.svg"    },
  { id: "RH",           label: "Recursos\nHumanos",  icon: "Users",        promptCount: 9,  mascotIcon: "/assets/mascot-icons/mascot_team.svg"     },
]

export const PROMPT_OF_THE_DAY = {
  title: "Análise SWOT Inteligente",
  description: "Gere uma análise SWOT completa para seu negócio com insights acionáveis.",
  categoryId: "Negocios",
  mascotIcon: "/assets/mascot-icons/mascot_growth.svg",
}
