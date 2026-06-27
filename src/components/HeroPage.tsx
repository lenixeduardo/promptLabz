import { useNavigate } from 'react-router-dom'
import { capture } from '@/lib/analytics'

const HAS_ACCOUNT_KEY = 'promptlabz:hasAccount'

/* ── Icon primitives ── */

function Sparkle({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true">
      <rect y="0"  width="20" height="2.2" rx="1.1" fill="#0F3D2E" />
      <rect y="7"  width="20" height="2.2" rx="1.1" fill="#0F3D2E" />
      <rect y="14" width="20" height="2.2" rx="1.1" fill="#0F3D2E" />
    </svg>
  )
}

function BookOpen() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function ShieldCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function LightningBolt({ size = 18, color = '#22C55E' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function StarFilled() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

/* ── Feature Card ── */

interface FeatureCardProps {
  illustration: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ illustration, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 flex flex-col items-center text-center border border-[#E8F7EC]" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div className="mb-2 mt-1">{illustration}</div>
      <h3 className="text-[#0F3D2E] font-bold text-[13px] leading-tight mb-1">{title}</h3>
      <p className="text-[#64748B] text-[11px] leading-[1.45]">{description}</p>
    </div>
  )
}

/* ── Cat-laptop illustration ── */
function CatLaptopIllustration() {
  return (
    <div className="relative w-[60px] h-[60px]">
      <img
        src="/cat-laptop.png"
        alt="Gato com laptop"
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  )
}

/* ── Trophy PNG ── */
function TrophyIllustration() {
  return (
    <div className="w-[60px] h-[60px]">
      <img src="/trophy.png" alt="Troféu" className="w-full h-full object-contain" />
    </div>
  )
}

/* ── Flame PNG ── */
function FlameIllustration() {
  return (
    <div className="w-[60px] h-[60px]">
      <img src="/flame.png" alt="Chama" className="w-full h-full object-contain" />
    </div>
  )
}

/* ── Green hills SVG background ── */
function HillsBackground() {
  return (
    <svg
      viewBox="0 80 375 50"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full block"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect width="375" height="130" fill="#E8F7EC" />
      <ellipse cx="280" cy="155" rx="220" ry="120" fill="#C8EED8" />
      <ellipse cx="60" cy="145" rx="140" ry="100" fill="#BBE8CB" />
      <ellipse cx="230" cy="180" rx="240" ry="155" fill="#86EFAC" />
      <ellipse cx="20" cy="140" rx="90" ry="70" fill="#A7F3D0" />
      <ellipse cx="355" cy="145" rx="80" ry="65" fill="#A7F3D0" />
      <rect x="0" y="105" width="375" height="25" fill="#86EFAC" />
      <ellipse cx="15" cy="107" rx="18" ry="12" fill="#4ADE80" />
      <ellipse cx="32" cy="109" rx="14" ry="10" fill="#4ADE80" />
      <ellipse cx="345" cy="106" rx="16" ry="11" fill="#4ADE80" />
      <ellipse cx="362" cy="108" rx="13" ry="9" fill="#4ADE80" />
      <ellipse cx="130" cy="112" rx="10" ry="7" fill="#4ADE80" />
      <ellipse cx="290" cy="110" rx="9" ry="6" fill="#4ADE80" />
      <line x1="85"  y1="110" x2="85"  y2="103" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="105" y1="108" x2="105" y2="101" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="180" y1="112" x2="180" y2="104" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="250" y1="110" x2="250" y2="103" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Cloud decoration ── */
function CloudShape({ className = '' }: { className?: string }) {
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" fill="white" className={className} aria-hidden="true">
      <ellipse cx="40" cy="28" rx="36" ry="14" />
      <ellipse cx="28" cy="22" rx="20" ry="16" />
      <ellipse cx="52" cy="20" rx="22" ry="18" />
      <ellipse cx="40" cy="16" rx="18" ry="14" />
    </svg>
  )
}

/* ── Avatar from sprite (avatars.jpg = 1069×235 — 3 people side by side) ── */
function AvatarPhoto({ person }: { person: 1 | 2 | 3 }) {
  // Rendered at height=36px → width≈163.8px; each person ≈54.6px wide
  const offsets = { 1: -9, 2: -64, 3: -118 }
  return (
    <div className="w-9 h-9 rounded-full border-[2.5px] border-white overflow-hidden flex-shrink-0">
      <img
        src="/avatars.jpg"
        alt=""
        style={{ height: '36px', width: 'auto', marginLeft: `${offsets[person]}px` }}
      />
    </div>
  )
}

/* ══════════════════════════════════════════════
   Main HeroPage Component
══════════════════════════════════════════════ */

export default function HeroPage() {
  const navigate = useNavigate()
  const hasAccount = typeof window !== 'undefined' && localStorage.getItem(HAS_ACCOUNT_KEY) === 'true'

  function handleCTA() {
    capture('hero_cta_clicked', { cta_text: hasAccount ? 'Continuar aprendendo' : 'Começar agora' })
    navigate(hasAccount ? '/login' : '/signup')
  }

  function handleLogin() {
    capture('hero_login_clicked')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#F6FBF7] font-sans">
      <div className="max-w-[430px] mx-auto overflow-hidden relative">

        {/* ── Navigation Header ── */}
        <header className="bg-white flex items-center justify-between px-4 py-3 sticky top-0 z-30 shadow-[0_1px_0_#E8F7EC]">
          {/* Logo PNG has large whitespace — wrapper clips to content area */}
          <div className="overflow-hidden flex-shrink-0" style={{ height: '40px', width: '128px' }}>
            <img
              src="/logo.png"
              alt="PromptLabz"
              style={{ width: '128px', height: 'auto', marginTop: '-69px' }}
            />
          </div>

          <button
            className="bg-[#F0F4F1] rounded-xl p-[10px] hover:bg-[#E2EDEA] transition-colors"
            aria-label="Menu"
            onClick={handleLogin}
          >
            <HamburgerIcon />
          </button>
        </header>

        {/* ── Hero Section ── */}
        <section className="bg-[#E8F7EC] relative overflow-hidden">

          <CloudShape className="absolute top-5 right-[34%] opacity-70 z-10" />

          <div className="absolute top-5 right-5 text-[#22C55E] z-30">
            <Sparkle size={24} />
          </div>
          <div className="absolute top-[130px] right-[46%] text-[#22C55E] z-30">
            <Sparkle size={10} />
          </div>

          <div className="relative">

            {/* Mascot — absolute right, overlaps text */}
            <div className="absolute right-0 top-0 bottom-0 z-20" style={{ width: '48%' }}>
              <img
                src="/mascot.png"
                alt="Mascote PromptLabz — gato estudioso com capelo"
                className="absolute inset-0 w-full h-full object-contain object-top"
              />
            </div>

            {/* Text content */}
            <div className="relative z-10 pl-5 pt-8 pb-0">

              <h1 className="text-[44px] font-extrabold leading-[1.08] tracking-tight text-[#0F3D2E]">
                Aprenda<br />
                Engenharia<br />
                de Prompts
              </h1>

              <div className="mt-1">
                <p className="text-[42px] font-extrabold leading-[1.1] tracking-tight text-[#22C55E]">
                  do zero ao
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-[42px] font-extrabold leading-[1.1] tracking-tight text-[#22C55E]">
                    avançado
                  </p>
                  <LightningBolt size={30} color="#22C55E" />
                </div>
              </div>

              <p className="text-[#0F3D2E] text-[13.5px] leading-[1.6] mt-3 mb-5 max-w-[240px]">
                Domine ChatGPT, Claude e IA generativa com lições gamificadas.
                Do zero ao avançado, sem precisar saber programar.
              </p>

            </div>

          </div>
        </section>

        {/* CTA — flutuando sobre a faixa verde entre hero e features */}
        <div className="relative z-10 flex justify-center px-4 -mt-6 mb-0">
          <button
            onClick={handleCTA}
            className="bg-[#0F3D2E] text-white font-bold text-[13px] uppercase tracking-[0.1em] py-[15px] rounded-full flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(15,61,46,0.4)] hover:bg-[#1a5c44] active:scale-[0.98] transition-all"
            style={{ width: '240px' }}
          >
            {hasAccount ? 'CONTINUAR' : 'COMEÇAR AGORA'}
            <ArrowRight />
          </button>
        </div>

        {/* ── Features Section ── */}
        <section className="bg-white px-4 pt-7 pb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkle size={13} className="text-[#22C55E]" />
              <h2 className="text-[15.5px] font-bold text-[#0F3D2E] leading-tight">
                Aprenda brincando. Evolua de verdade.
              </h2>
              <Sparkle size={13} className="text-[#22C55E]" />
            </div>
            <p className="text-[13px] text-[#64748B] leading-[1.55]">
              Lições curtas, desafios e recompensas para você<br />
              aprender mais e melhor todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <FeatureCard
              illustration={<CatLaptopIllustration />}
              title="Lições práticas"
              description="Conteúdo direto ao ponto com exemplos reais."
            />
            <FeatureCard
              illustration={<TrophyIllustration />}
              title="Gamificado"
              description="Ganhe XP, conquistas e suba de nível."
            />
            <FeatureCard
              illustration={<FlameIllustration />}
              title="Progresso real"
              description="Acompanhe seu progresso e veja sua evolução."
            />
          </div>
        </section>

        {/* ── Social Proof Section ── */}
        <section className="bg-[#E8F7EC] px-4 py-5">
          <div className="flex items-center gap-3">

            <div className="flex items-start gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-0.5">
                <HeartIcon />
              </div>
              <p className="text-[11.5px] text-[#0F3D2E] leading-[1.5]">
                Junte-se a milhares de alunos que já estão evoluindo com o{' '}
                <span className="text-[#22C55E] font-semibold">PromptLabz</span>
              </p>
            </div>

            <div className="flex -space-x-2.5 flex-shrink-0">
              <AvatarPhoto person={1} />
              <AvatarPhoto person={2} />
              <AvatarPhoto person={3} />
              <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-[#22C55E] flex items-center justify-center text-white font-bold flex-shrink-0" style={{ fontSize: '9px' }}>
                +5k
              </div>
            </div>

            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-0.5 justify-end">
                <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
              </div>
              <div className="text-[#0F3D2E] font-bold text-[13.5px] mt-0.5">4.9/5</div>
              <div className="text-[#64748B] text-[10.5px]">de alunos</div>
            </div>

          </div>
        </section>

      </div>
    </div>
  )
}
