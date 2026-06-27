import { PageSEO } from "@/components/PageSEO"
import HeroPage from "@/components/HeroPage"

export default function Hero() {
  return (
    <>
      <PageSEO
        title="Aprenda Engenharia de Prompts — Curso Gratuito de IA"
        description="Aprenda engenharia de prompts do zero com lições gamificadas. Plataforma 100% gratuita para dominar ChatGPT, Claude e IA generativa. Comece agora sem cartão de crédito!"
        canonicalPath="/"
      />
      <HeroPage />
    </>
  )
}
