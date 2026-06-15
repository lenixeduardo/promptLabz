export interface Challenge {
  id: string
  module: string
  step: number
  totalSteps: number
  title: string
  subtitle: string
  task: string
  tip: string
  examplePrompt: string
}

export const CHALLENGES: Challenge[] = [
  {
    id: "context-is-everything",
    module: "Estrutura de Prompts",
    step: 0,
    totalSteps: 5,
    title: "Desafio: Contexto é tudo!",
    subtitle: "Crie um prompt claro e rico em contexto.",
    task: "Escreva um prompt para pedir ideias de conteúdo para redes sociais sobre produtividade.",
    tip: "Dica: adicione o tom, formato e exemplos de temas.",
    examplePrompt:
      "Você é um especialista em marketing de conteúdo para empreendedores digitais. Crie 10 ideias de posts para Instagram sobre produtividade, voltados para empreendedores que trabalham de casa. Use um tom inspirador e prático. Inclua sugestões de formato (carrossel, reels ou stories) e temas como gestão de tempo, foco, rotina matinal e ferramentas digitais.",
  },
  {
    id: "define-your-audience",
    module: "Estrutura de Prompts",
    step: 1,
    totalSteps: 5,
    title: "Desafio: Quem é o público?",
    subtitle: "Especifique o público-alvo no seu prompt.",
    task: "Escreva um prompt pedindo dicas de estudo, mas desta vez inclua claramente quem vai usar esse conteúdo.",
    tip: "Dica: mencione faixa etária, nível de conhecimento ou contexto de vida do público.",
    examplePrompt:
      "Atue como um pedagogo especializado em aprendizado para adultos. Liste 8 técnicas de estudo eficientes para profissionais entre 25 e 40 anos que estão retomando os estudos depois de muitos anos parados. As dicas devem ser práticas e adaptadas a quem tem pouco tempo disponível no dia a dia.",
  },
  {
    id: "be-specific",
    module: "Estrutura de Prompts",
    step: 2,
    totalSteps: 5,
    title: "Desafio: Seja específico!",
    subtitle: "Adicione detalhes de formato e estrutura ao seu prompt.",
    task: "Crie um prompt pedindo um plano de ação para aprender uma nova habilidade. Inclua como quer receber a resposta.",
    tip: "Dica: especifique número de etapas, duração estimada e formato da resposta.",
    examplePrompt:
      "Crie um plano de estudos de 30 dias para aprender design de interfaces (UI) do zero. Estruture o plano em semanas, com metas semanais claras. Para cada semana, inclua: 3 recursos gratuitos (vídeos ou artigos), 1 projeto prático e a habilidade principal desenvolvida. Formato: tabela ou lista organizada por semana.",
  },
  {
    id: "tone-and-style",
    module: "Estrutura de Prompts",
    step: 3,
    totalSteps: 5,
    title: "Desafio: Tom e estilo",
    subtitle: "Defina o tom e o estilo de escrita no seu prompt.",
    task: "Escreva um prompt pedindo um texto de marketing para um produto. Inclua o tom que você quer que o texto tenha.",
    tip: "Dica: descreva o tom (formal, descontraído, urgente, inspirador) e o tamanho esperado.",
    examplePrompt:
      "Escreva um texto de marketing para redes sociais anunciando um curso online de finanças pessoais. Tom: descontraído e motivador, como um amigo que entende de dinheiro. Tamanho: até 150 palavras. Inclua um gancho inicial forte, 2 benefícios principais do curso e um call-to-action criativo. Evite linguagem muito técnica.",
  },
  {
    id: "the-complete-prompt",
    module: "Estrutura de Prompts",
    step: 4,
    totalSteps: 5,
    title: "Desafio: O prompt completo!",
    subtitle: "Combine contexto, público-alvo, detalhes e tom em um único prompt.",
    task: "Crie um prompt completo que inclua: contexto, público-alvo, formato da resposta e tom. Escolha qualquer tema que quiser.",
    tip: "Dica: revise seu prompt com a checklist — contexto ✓, público ✓, formato ✓, tom ✓.",
    examplePrompt:
      "Você é um coach de carreira especializado em transição profissional. Escreva um guia prático para profissionais de 30 a 45 anos que querem mudar de área sem voltar para a faculdade. Público: pessoas com experiência consolidada em outra área, mas sem habilidades técnicas na nova área desejada. Formato: 5 passos numerados, cada um com título e 2 a 3 ações concretas. Tom: encorajador e direto, sem romantizar o processo.",
  },
]

export function getChallengeByStep(step: number): Challenge {
  const idx = Math.max(0, Math.min(step, CHALLENGES.length - 1))
  return CHALLENGES[idx]
}
