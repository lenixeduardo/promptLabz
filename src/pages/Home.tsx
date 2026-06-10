import { Link } from "react-router-dom"
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
} from "lucide-react"
import { BrandLogo } from "@/components/BrandLogo"
import { cn } from "@/lib/utils"

const features = [
  { title: "My Skills", icon: PawPrint, to: "#" },
  { title: "Prompt Library", icon: Lightbulb, to: "#" },
  { title: "Learning Lab", icon: GraduationCap, to: "/learn" },
]

const chips = [
  { label: "Trending Skills", icon: TrendingUp },
  { label: "Community Hub", icon: Users },
  { label: "Design", icon: Pencil },
  { label: "Prompt Science", icon: ThumbsUp },
  { label: "Prompt Engineering", icon: Lightbulb },
  { label: "Advanced Science", icon: GraduationCap },
  { label: "Hour of Focus", icon: BarChart3 },
]

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#EAF7EF] to-[#BFE6CF]">
      {/* Running cat mascot bleeding off the right edge */}
      <img
        src="/assets/mascot-home.png"
        alt="PromptLab mascot"
        className="pointer-events-none absolute right-0 top-24 hidden h-80 w-auto object-contain lg:block"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-7">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <BrandLogo className="text-3xl" />
          <button
            aria-label="Account"
            className="h-12 w-12 overflow-hidden rounded-full border border-[#BFE3CC] bg-white shadow-sm"
          >
            <img
              src="/assets/avatar-cat.png"
              alt="Account"
              className="h-full w-full object-contain"
            />
          </button>
        </header>

        {/* Hero search */}
        <div className="mx-auto mt-12 w-full max-w-2xl">
          <div className="flex items-center gap-3 rounded-full border border-[#BFE3CC] bg-white px-6 py-4 shadow-md ring-4 ring-[#DCF1E4]">
            <Search className="h-6 w-6 text-primary" strokeWidth={2.2} />
            <input
              type="text"
              placeholder="Search skills, prompts, lessons…"
              className="flex-1 bg-transparent text-lg text-foreground placeholder:text-[#8A998F] focus:outline-none"
            />
            <Sparkles className="h-6 w-6 text-[#3E8E5E]" strokeWidth={2.2} />
          </div>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map(({ title, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="flex flex-col items-center gap-5 rounded-3xl border border-[#BFE3CC] bg-white/70 px-6 py-8 text-center shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-xl font-bold text-[#1F2A24]">{title}</span>
              <Icon className="h-12 w-12 text-[#3E8E5E]" strokeWidth={2} />
            </Link>
          ))}
        </div>

        {/* Continue Learning */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[#1F2A24]">Continue Learning</h2>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {chips.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border border-[#CDEAD8] bg-white px-4 py-2.5",
                  "text-sm font-medium text-[#2A3B30] shadow-sm transition-colors hover:bg-[#F0FAF3]"
                )}
              >
                <Icon className="h-4 w-4 text-[#3E8E5E]" strokeWidth={2.2} />
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
