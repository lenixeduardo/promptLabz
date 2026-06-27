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
        <div className="absolute w-[32.6%] h-[3.01%] top-[2.26%] left-[6.5%]">
          <div className="text-[5.45cqw] text-start text-[#003214] font-heavy">Prompt</div>
          <div className="text-[5.45cqw] text-start text-[#48b63f] font-heavy">Labz</div>
        </div>
        <div className="absolute w-[52.67%] h-[4.56%] top-[19.34%] left-[6.75%]">
          <div className="text-[8.30cqw] text-start text-[#003214] font-heavy">Aprenda IA</div>
        </div>
        <div className="absolute w-[34.7%] h-[7.32%] top-[24.94%] left-[6.4%]">
          <div className="text-[6.84cqw] text-start text-[#003214] font-heavy">do zero ao avançado</div>
        </div>
        <div className="absolute w-[9.6%] h-[0.98%] top-[51.21%] left-[26.4%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">Gamificado</div>
        </div>
        <div className="absolute w-[59.1%] h-[1.67%] top-[65.26%] left-[20.8%]">
          <div className="text-[3.05cqw] text-center text-[#003214] font-heavy">Aprenda brincando. Evolua de verdade.</div>
        </div>
        <div className="absolute w-[50.8%] h-[2.9%] top-[68.2%] left-[24.6%]">
          <div className="text-[2.45cqw] text-center text-[#003214]">Lições curtas, desafios e recompensas para você aprender mais e melhor
            todos os dias.</div>
        </div>
        <div className="absolute w-[17.4%] h-[1.28%] top-[82.21%] left-[10.7%]">
          <div className="text-[2.39cqw] text-center text-[#003214] font-heavy">Lições práticas</div>
        </div>
        <div className="absolute w-[20.6%] h-[2.32%] top-[84.39%] left-[9.4%]">
          <div className="text-[1.79cqw] text-center text-[#003214]">Conteúdo direto ao ponto com exemplos reais.</div>
        </div>
        <div className="absolute w-[13.4%] h-[1.34%] top-[82.18%] left-[42.7%]">
          <div className="text-[2.45cqw] text-center text-[#003214] font-heavy">Gamificado</div>
        </div>
        <div className="absolute w-[17.4%] h-[2.21%] top-[84.45%] left-[40.8%]">
          <div className="text-[1.72cqw] text-center text-[#003214]">Ganhe XP, conquistas e suba de nível.</div>
        </div>
        <div className="absolute w-[17.1%] h-[1.28%] top-[82.21%] left-[71.2%]">
          <div className="text-[2.39cqw] text-center text-[#003214] font-heavy">Progresso real</div>
        </div>
        <div className="absolute w-[21.1%] h-[2.21%] top-[84.45%] left-[69.4%]">
          <div className="text-[1.72cqw] text-center text-[#003214]">Acompanhe seu progresso e veja sua evolução.</div>
        </div>
        <div className="absolute w-[19.4%] h-[3.64%] top-[92.13%] left-[19.7%]">
          <div className="text-[1.92cqw] text-start text-[#003214]">Junte-se aos alunos que já estão evoluindo com o</div>
        </div>
        <div
          className="absolute w-[24.4%] h-[1.39%] top-[45.76%] left-[11.8%] cursor-pointer"
          onClick={handleCTA}
          role="button"
          aria-label={hasAccount ? 'Continuar' : 'Começar agora'}
        >
          <div className="text-[2.59cqw] text-start text-[#ffffff] font-heavy">Começar agora</div>
        </div>
        <div className="absolute w-[36.4%] h-[2.8%] top-[34.4%] left-[6.7%]">
          <div className="text-[2.32cqw] text-start text-[#003214]">Domine ChatGPT, Claude e IA generativa com lições gamificadas.</div>
        </div>
        <div className="absolute w-[27.5%] h-[2.8%] top-[38.3%] left-[6.7%]">
          <div className="text-[2.32cqw] text-start text-[#003214]">Do zero ao avançado, sem precisar saber programar.</div>
        </div>
        <div className="absolute w-[4.9%] h-[1.95%] top-[51.02%] left-[11.2%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">68+ lições</div>
        </div>
        <div className="absolute w-[5.4%] h-[1.95%] top-[51.02%] left-[45.7%]">
          <div className="text-[1.86cqw] text-start text-[#003214]">100% grátis</div>
        </div>
        <div className="absolute w-[11.3%] h-[0.98%] top-[96.31%] left-[19.7%]">
          <div className="text-[1.86cqw] text-start text-[#48b63f] font-heavy">PromptLabz</div>
        </div>
        <div className="absolute w-[7.8%] h-[1.71%] top-[94.35%] left-[78.4%]">
          <div className="text-[3.19cqw] text-center text-[#003214] font-heavy">4.9/5</div>
        </div>
        <div className="absolute w-[8.3%] h-[0.98%] top-[96.51%] left-[78.3%]">
          <div className="text-[1.86cqw] text-center text-[#003214]">de alunos</div>
        </div>
      </div>
    </div>
  )
}
