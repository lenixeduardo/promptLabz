import { useNavigate } from 'react-router-dom'
import { capture } from '@/lib/analytics'

const HAS_ACCOUNT_KEY = 'promptlabz:hasAccount'

export default function HeroPage() {
  const navigate = useNavigate()
  const hasAccount = typeof window !== 'undefined' && localStorage.getItem(HAS_ACCOUNT_KEY) === 'true'

  function handleCTA() {
    capture('hero_cta_clicked', { cta_text: hasAccount ? 'Continuar' : 'Começar agora' })
    navigate(hasAccount ? '/login' : '/signup')
  }

  return (
    <div className="max-w-[430px] mx-auto overflow-hidden">
      <div className="relative [container-type:inline-size] font-[Nunito]">
        <img src="background.png" alt="" className="w-full h-full" />

        {/* Nav — PromptLabz logo */}
        <div className="absolute w-[32.6%] h-[2.30%] top-[2.26%] left-[6.5%]">
          <div className="text-[5.45cqw] text-start text-[#003214] font-heavy">Prompt</div>
          <div className="text-[5.45cqw] text-start text-[#48b63f] font-heavy">Labz</div>
        </div>

        {/* Hero title — barra dark green medida em 22.70% */}
        <div className="absolute w-[52.67%] h-[3.48%] top-[21.50%] left-[6.75%]">
          <div className="text-[8.30cqw] text-start text-[#003214] font-heavy">Aprenda IA</div>
        </div>

        {/* Hero subtitle — medido em 27.25% */}
        <div className="absolute w-[34.7%] h-[5.60%] top-[25.50%] left-[6.4%]">
          <div className="text-[6.84cqw] text-start text-[#003214] font-heavy">do zero ao avançado</div>
        </div>

        {/* Description 1 */}
        <div className="absolute w-[36.4%] h-[2.14%] top-[30.20%] left-[6.7%]">
          <div className="text-[2.32cqw] text-start text-[#003214]">Domine ChatGPT, Claude e IA generativa com lições gamificadas.</div>
        </div>

        {/* Description 2 */}
        <div className="absolute w-[27.5%] h-[2.14%] top-[32.70%] left-[6.7%]">
          <div className="text-[2.32cqw] text-start text-[#003214]">Do zero ao avançado, sem precisar saber programar.</div>
        </div>

        {/* CTA button — medido em 34.18% */}
        <div
          className="absolute w-[24.4%] h-[1.06%] top-[35.20%] left-[11.8%] cursor-pointer"
          onClick={handleCTA}
          role="button"
          aria-label={hasAccount ? 'Continuar' : 'Começar agora'}
        >
          <div className="text-[2.59cqw] text-start text-[#ffffff] font-heavy">Começar agora</div>
        </div>

        {/* Stats — 68+ lições */}
        <div className="absolute w-[4.9%] h-[1.49%] top-[40.00%] left-[11.2%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">68+ lições</div>
        </div>

        {/* Stats — Gamificado */}
        <div className="absolute w-[9.6%] h-[0.75%] top-[40.00%] left-[26.4%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">Gamificado</div>
        </div>

        {/* Stats — 100% grátis */}
        <div className="absolute w-[5.4%] h-[1.49%] top-[40.00%] left-[45.7%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">100% grátis</div>
        </div>

        {/* "Aprenda brincando" heading — medido em 43.34% */}
        <div className="absolute w-[59.1%] h-[1.28%] top-[45.60%] left-[20.8%]">
          <div className="text-[3.05cqw] text-center text-[#003214] font-heavy">Aprenda brincando. Evolua de verdade.</div>
        </div>

        {/* Sub-description */}
        <div className="absolute w-[50.8%] h-[2.22%] top-[47.80%] left-[24.6%]">
          <div className="text-[2.45cqw] text-center text-[#003214]">Lições curtas, desafios e recompensas para você aprender mais e melhor todos os dias.</div>
        </div>

        {/* Card 1 — Lições práticas title — medido ~62.57% */}
        <div className="absolute w-[17.4%] h-[0.98%] top-[62.50%] left-[10.7%]">
          <div className="text-[2.39cqw] text-center text-[#003214] font-heavy">Lições práticas</div>
        </div>

        {/* Card 1 — description */}
        <div className="absolute w-[20.6%] h-[1.78%] top-[64.20%] left-[9.4%]">
          <div className="text-[1.79cqw] text-center text-[#003214]">Conteúdo direto ao ponto com exemplos reais.</div>
        </div>

        {/* Card 2 — Gamificado title */}
        <div className="absolute w-[13.4%] h-[1.02%] top-[62.50%] left-[42.7%]">
          <div className="text-[2.45cqw] text-center text-[#003214] font-heavy">Gamificado</div>
        </div>

        {/* Card 2 — description */}
        <div className="absolute w-[17.4%] h-[1.69%] top-[64.20%] left-[40.8%]">
          <div className="text-[1.72cqw] text-center text-[#003214]">Ganhe XP, conquistas e suba de nível.</div>
        </div>

        {/* Card 3 — Progresso real title */}
        <div className="absolute w-[17.1%] h-[0.98%] top-[62.50%] left-[71.2%]">
          <div className="text-[2.39cqw] text-center text-[#003214] font-heavy">Progresso real</div>
        </div>

        {/* Card 3 — description */}
        <div className="absolute w-[21.1%] h-[1.69%] top-[64.20%] left-[69.4%]">
          <div className="text-[1.72cqw] text-center text-[#003214]">Acompanhe seu progresso e veja sua evolução.</div>
        </div>

        {/* Social proof — "Junte-se" medido em 74.59% */}
        <div className="absolute w-[19.4%] h-[2.78%] top-[74.59%] left-[19.7%]">
          <div className="text-[1.92cqw] text-start text-[#003214]">Junte-se aos alunos que já estão evoluindo com o</div>
        </div>

        {/* Social proof — PromptLabz link */}
        <div className="absolute w-[11.3%] h-[0.75%] top-[77.70%] left-[19.7%]">
          <div className="text-[1.86cqw] text-start text-[#48b63f] font-heavy">PromptLabz</div>
        </div>

        {/* Rating 4.9/5 */}
        <div className="absolute w-[7.8%] h-[1.30%] top-[75.60%] left-[78.4%]">
          <div className="text-[3.19cqw] text-center text-[#003214] font-heavy">4.9/5</div>
        </div>

        {/* Rating label */}
        <div className="absolute w-[8.3%] h-[0.75%] top-[77.60%] left-[78.3%]">
          <div className="text-[1.86cqw] text-center text-[#003214]">de alunos</div>
        </div>
      </div>
    </div>
  )
}
