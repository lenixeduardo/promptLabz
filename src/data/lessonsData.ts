export interface ContentBlock {
  type: "text" | "quote" | "heading";
  text: string;
}

export interface QuestionOption {
  letter: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
  correct: string;
}

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  duration: string;
  content: ContentBlock[];
  questions: Question[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Category {
  id: string;
  title: string;
  modules: Module[];
}

export const lessonsData: Record<string, Category> = {
  "trending-skills": {
    id: "trending-skills",
    title: "Trending Skills",
    modules: [
      {
        id: "ts-mod-1",
        title: "Módulo 1: IA Generativa no Cotidiano",
        lessons: [
          {
            id: "ts-mod-1-l1",
            title: "A Revolução dos Modelos de Linguagem (LLMs)",
            icon: "TrendingUp",
            duration: "10 min",
            content: [
              {
                type: "heading",
                text: "Entendendo os Modelos de Linguagem de Larga Escala"
              },
              {
                type: "text",
                text: "Os Large Language Models (LLMs) transformaram drasticamente a maneira como interagimos com a computação. Diferente de sistemas tradicionais baseados em regras rígidas, os LLMs utilizam redes neurais profundas para prever a próxima palavra com base no contexto fornecido pelo usuário."
              },
              {
                type: "quote",
                text: "\"Os LLMs não 'pensam' como humanos, mas sim calculam distribuições estatísticas de probabilidade sobre sequências de caracteres obtidas em bases massivas de dados.\""
              },
              {
                type: "heading",
                text: "Aplicações Práticas Atuais"
              },
              {
                type: "text",
                text: "Hoje em dia, dominar LLMs permite acelerar a escrita de e-mails, resumir relatórios extensos e até criar ideias inovadoras do zero. Saber formular a pergunta ou instrução correta é a chave para extrair o valor máximo dessas ferramentas."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Como os Large Language Models (LLMs) geram respostas?",
                options: [
                  { letter: "A", text: "Procurando respostas pré-programadas em um banco de dados estático." },
                  { letter: "B", text: "Prevendo a próxima palavra mais provável de acordo com o contexto estatístico fornecido." },
                  { letter: "C", text: "Utilizando raciocínio lógico biológico idêntico ao do cérebro humano." },
                  { letter: "D", text: "Copiando e colando textos diretamente da internet em tempo real." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual é o principal fator para obter o melhor resultado de um LLM?",
                options: [
                  { letter: "A", text: "Ter uma velocidade alta de digitação." },
                  { letter: "B", text: "A escolha do navegador de internet utilizado." },
                  { letter: "C", text: "A precisão, clareza e estrutura do prompt enviado." },
                  { letter: "D", text: "O tamanho físico do computador." }
                ],
                correct: "C"
              }
            ]
          },
          {
            id: "ts-mod-1-l2",
            title: "Anatomia de um Prompt Eficiente",
            icon: "Settings",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Os Pilares de um Prompt Perfeito"
              },
              {
                type: "text",
                text: "Um prompt de alta performance não é apenas uma pergunta vaga. Ele é constituído por quatro componentes fundamentais: Instrução (o que fazer), Contexto (o cenário ou dados), Entrada (a informação a ser processada) e Saída (o formato desejado)."
              },
              {
                type: "quote",
                text: "\"Exemplo: 'Escreva um resumo (Instrução) do texto abaixo (Entrada) em formato de tópicos (Saída), focando no público executivo (Contexto/Filtro)'.\""
              },
              {
                type: "text",
                text: "Ao fornecer explicitamente esses elementos, você reduz drasticamente as chances de alucinação do modelo e garante uma resposta imediatamente útil, sem necessidade de infinitos ajustes."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Quais são os quatro componentes ideais para a anatomia de um prompt?",
                options: [
                  { letter: "A", text: "Saudação, pergunta, assinatura e anexo." },
                  { letter: "B", text: "Instrução, Contexto, Entrada e Saída." },
                  { letter: "C", text: "Algoritmo, Código, Servidor e Interface." },
                  { letter: "D", text: "Título, Autor, Data e Resumo." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "O que ajuda a evitar as 'alucinações' em modelos de linguagem?",
                options: [
                  { letter: "A", text: "Fornecer contextos claros, limites bem definidos e instruções detalhadas de saída." },
                  { letter: "B", text: "Fazer perguntas confusas para testar a inteligência do modelo." },
                  { letter: "C", text: "Digitar tudo em letras maiúsculas." },
                  { letter: "D", text: "Usar apenas uma palavra no prompt inteiro." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      },
      {
        id: "ts-mod-2",
        title: "Módulo 2: IA nas Profissões Modernas",
        lessons: [
          {
            id: "ts-mod-2-l1",
            title: "Co-pilotagem de Código para Não Programadores",
            icon: "Code2",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Programando através da Linguagem Natural"
              },
              {
                type: "text",
                text: "Com a popularização de assistentes de codificação, a barreira técnica para desenvolver scripts simples, automações de planilhas e páginas web básicas praticamente desapareceu. Agora, qualquer profissional pode atuar como gestor de projetos técnicos instruindo a IA em português sobre qual lógica ela deve construir."
              },
              {
                type: "quote",
                text: "\"O segredo de trabalhar com IAs de codificação é a modularização: quebre seu problema em pequenos scripts menores, teste cada um deles e depois junte-os.\""
              },
              {
                type: "text",
                text: "Quando você pede à IA para construir um sistema gigante de uma vez, as chances de bugs são imensas. Ao pedir pequenas partes, como 'escreva uma função que leia um arquivo Excel e remova duplicados', você garante precisão absoluta."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a melhor estratégia ao usar IA para gerar código sendo um não programador?",
                options: [
                  { letter: "A", text: "Pedir para a IA criar todo o sistema de uma vez sem dar detalhes." },
                  { letter: "B", text: "Modularizar o problem em partes menores, testar cada uma e depois integrá-las." },
                  { letter: "C", text: "Apenas copiar códigos prontos de fóruns sem ler o que eles fazem." },
                  { letter: "D", text: "Evitar o uso de linguagem natural e tentar aprender sintaxe complexa no primeiro dia." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "O que a modularização de código facilita?",
                options: [
                  { letter: "A", text: "O aumento do custo de processamento." },
                  { letter: "B", text: "A detecção rápida de bugs e a precisão do desenvolvimento passo a passo." },
                  { letter: "C", text: "A dependência excessiva de computadores quânticos." },
                  { letter: "D", text: "A exclusão automática de arquivos do sistema." }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "ts-mod-2-l2",
            title: "Automação de Fluxos de Trabalho com IA",
            icon: "Activity",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Conectando Ferramentas e IAs"
              },
              {
                type: "text",
                text: "Automatizar fluxos operacionais repetitivos é o superpoder dos profissionais mais produtivos da atualidade. Integrando LLMs a ferramentas de automação como Zapier, Make ou n8n, é possível classificar e-mails de clientes automaticamente, gerar respostas rascunhadas e atualizar bancos de dados em segundos."
              },
              {
                type: "quote",
                text: "\"A IA atua como o motor de decisão cognitivo que analisa a entrada de dados e decide qual ação tomar, eliminando a triagem manual enfadonha.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual o papel de uma IA em uma automação de fluxo de trabalho?",
                options: [
                  { letter: "A", text: "Apenas armazenar dados de login dos usuários." },
                  { letter: "B", text: "Tomar decisões cognitivas baseadas no conteúdo recebido, como categorizar ou resumir informações." },
                  { letter: "C", text: "Aumentar a velocidade da rede Wi-Fi." },
                  { letter: "D", text: "Substituir a necessidade de qualquer conexão com a internet." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Ferramentas como Zapier e Make servem para quê?",
                options: [
                  { letter: "A", text: "Formatar discos rígidos de servidores." },
                  { letter: "B", text: "Conectar diferentes aplicativos para criar fluxos de automação integrados." },
                  { letter: "C", text: "Substituir a tela do monitor por realidade virtual." },
                  { letter: "D", text: "Apenas hospedar sites estáticos de portfólio." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      }
    ]
  },
  "community-hub": {
    id: "community-hub",
    title: "Community Hub",
    modules: [
      {
        id: "ch-mod-1",
        title: "Módulo 1: Colaboração e Compartilhamento de Prompts",
        lessons: [
          {
            id: "ch-mod-1-l1",
            title: "Engenharia Reversa de Prompts Comunitários",
            icon: "Users",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Aprendendo com a Inteligência Coletiva"
              },
              {
                type: "text",
                text: "A engenharia reversa de prompts consiste em analisar prompts criados por outros especialistas da comunidade e decompor seus elementos para entender por que eles funcionam tão bem. Ao fazer isso, você desenvolve intuição sobre gatilhos semânticos e estruturas de formatação específicas que otimizam as respostas dos LLMs."
              },
              {
                type: "quote",
                text: "\"Olhar para os prompts compartilhados em repositórios abertos é a forma mais rápida de pular a curva de aprendizado inicial e aplicar técnicas avançadas de imediato.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que é a Engenharia Reversa de Prompts?",
                options: [
                  { letter: "A", text: "Descompilar o código-fonte binário de um modelo de linguagem proprietário." },
                  { letter: "B", text: "Analisar prompts de sucesso criados pela comunidade para compreender seus padrões e replicá-los." },
                  { letter: "C", text: "Escrever prompts de trás para frente para confundir as diretrizes de segurança da IA." },
                  { letter: "D", text: "Traduzir prompts do português para outros idiomas antigos automaticamente." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual a vantagem de estudar prompts criados por especialistas?",
                options: [
                  { letter: "A", text: "Garantir que os modelos consumam menos energia elétrica." },
                  { letter: "B", text: "Evitar a necessidade de pagar assinaturas mensais das plataformas." },
                  { letter: "C", text: "Adquirir intuição sobre quais estruturas sintáticas e semânticas funcionam melhor." },
                  { letter: "D", text: "Obter direitos autorais automáticos sobre as respostas geradas." }
                ],
                correct: "C"
              }
            ]
          },
          {
            id: "ch-mod-1-l2",
            title: "Open Source e Modelos Abertos",
            icon: "Share2",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "O Poder dos Modelos Locais e Abertos"
              },
              {
                type: "text",
                text: "Modelos abertos (como Llama, Mistral e Gemma) democratizaram o desenvolvimento de soluções baseadas em IA. Estudar e colaborar com projetos open source permite criar aplicações altamente personalizadas que rodam localmente em servidores próprios ou até mesmo em computadores pessoais, garantindo privacidade e controle total dos dados."
              },
              {
                type: "quote",
                text: "\"Os modelos open source reduzem a dependência de APIs fechadas e possibilitam o ajuste fino (fine-tuning) para nichos específicos de mercado.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é uma das principais vantagens dos modelos open source de IA?",
                options: [
                  { letter: "A", text: "Eles são sempre maiores e mais lentos que os modelos comerciais." },
                  { letter: "B", text: "A facilidade de executá-los localmente com total controle sobre a privacidade dos dados." },
                  { letter: "C", text: "A impossibilidade de modificação por programadores terceiros." },
                  { letter: "D", text: "O fato de não precisarem de eletricidade para funcionar." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "O que significa 'fine-tuning' em modelos abertos?",
                options: [
                  { letter: "A", text: "Limpar o teclado do computador para digitar mais rápido." },
                  { letter: "B", text: "Ajustar os parâmetros de rede do modem de internet." },
                  { letter: "C", text: "Treinar adicionalmente um modelo pré-existente com um conjunto de dados específico para especializá-lo em uma tarefa." },
                  { letter: "D", text: "Traduzir a interface do chat para diferentes línguas." }
                ],
                correct: "C"
              }
            ]
          }
        ]
      },
      {
        id: "ch-mod-2",
        title: "Módulo 2: Ética e Governança na Comunidade de IA",
        lessons: [
          {
            id: "ch-mod-2-l1",
            title: "O Papel dos Vieses nos Modelos Públicos",
            icon: "Eye",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "A Origem dos Preconceitos e Estereótipos Algorítmicos"
              },
              {
                type: "text",
                text: "Os modelos de linguagem aprendem a partir de textos históricos criados por seres humanos. Consequentemente, eles tendem a reproduzir preconceitos sociais, de gênero, raça e nacionalidade presentes em seus dados de treinamento. Entender esses vieses é vital para criar prompts de mitigação de preconceito."
              },
              {
                type: "quote",
                text: "\"Como engenheiro de prompts, você pode instruir explicitamente o modelo a manter imparcialidade e diversidade de perspectivas em suas respostas.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "De onde vêm os vieses presentes nos modelos de IA públicos?",
                options: [
                  { letter: "A", text: "De erros propositais introduzidos pelos desenvolvedores de hardware." },
                  { letter: "B", text: "Dos vieses e preconceitos contidos nos dados de treinamento históricos da internet." },
                  { letter: "C", text: "Dos satélites de comunicação que transmitem os dados." },
                  { letter: "D", text: "A IA cria sentimentos preconceituosos de forma consciente e autônoma." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como um usuário de IA pode ajudar a mitigar os vieses nas respostas do modelo?",
                options: [
                  { letter: "A", text: "Escrevendo prompts que exigem neutralidade, objetividade científica e diversidade de perspectivas." },
                  { letter: "B", text: "Pedindo para a IA mentir sobre fatos históricos." },
                  { letter: "C", text: "Usando termos ofensivos no prompt de entrada." },
                  { letter: "D", text: "Não há como influenciar a resposta, pois os modelos são 100% rígidos." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "ch-mod-2-l2",
            title: "Direitos Autorais e Propriedade Intelectual em IA",
            icon: "Lock",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "O Desafio Legal da Geração de Conteúdo"
              },
              {
                type: "text",
                text: "A quem pertence um texto ou imagem gerada por uma inteligência artificial? As leis de propriedade intelectual ao redor do mundo estão se adaptando rapidamente a essa nova realidade. Compreender a diferença entre dados proprietários, uso de domínio público e direitos de uso comercial é essencial para proteger seus produtos."
              },
              {
                type: "quote",
                text: "\"Atualmente, na maioria dos países, obras puramente geradas por máquinas, sem intervenção humana significativa, não gozam de direitos autorais tradicionais.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é o consenso geral da maioria das legislações sobre obras geradas integralmente por IA sem interferência humana?",
                options: [
                  { letter: "A", text: "Elas pertencem automaticamente ao fabricante do computador do usuário." },
                  { letter: "B", text: "Elas não recebem proteção de direitos autorais por carecerem de autoria humana direta." },
                  { letter: "C", text: "Elas pertencem ao governo federal do país de origem." },
                  { letter: "D", text: "Elas são patenteadas como segredo de Estado." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como garantir maior segurança jurídica ao utilizar IA em projetos comerciais?",
                options: [
                  { letter: "A", text: "Mesclando as gerações com modificações, curadoria e toques autorais humanos significativos." },
                  { letter: "B", text: "Apenas fingindo que a IA nunca foi usada na produção." },
                  { letter: "C", text: "Registrando o prompt bruto no cartório como se fosse código de computador." },
                  { letter: "D", text: "Processando os criadores do modelo de linguagem preventivamente." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      }
    ]
  },
  "design": {
    id: "design",
    title: "Design",
    modules: [
      {
        id: "des-mod-1",
        title: "Módulo 1: Engenharia de Prompts para Geração de Imagens",
        lessons: [
          {
            id: "des-mod-1-l1",
            title: "Princípios Básicos do Midjourney e DALL-E 3",
            icon: "Palette",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Como os Geradores de Imagem Interpretam Prompts"
              },
              {
                type: "text",
                text: "Modelos de difusão como Midjourney, DALL-E 3 e Stable Diffusion convertem ruído aleatório em imagens estruturadas guiando-se por texto. Escrever prompts de imagem eficientes requer ser descritivo com o objeto principal, com o estilo visual (fotografia, ilustração 3D, pintura a óleo) e com as proporções desejadas."
              },
              {
                type: "quote",
                text: "\"Um bom prompt visual indica claramente o que deve aparecer na cena, o estilo artístico, a iluminação e as especificações de câmera ou rendering.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é o mecanismo fundamental dos modelos de geração de imagem modernos?",
                options: [
                  { letter: "A", text: "Eles buscam imagens prontas no Google e as recortam juntas." },
                  { letter: "B", text: "Modelos de difusão que removem gradualmente o ruído aleatório sob a orientação de descrições textuais." },
                  { letter: "C", text: "Eles desenham em tempo real usando uma mesa digitalizadora virtual interna." },
                  { letter: "D", text: "Eles traduzem o código HTML em formato PNG." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual é um exemplo de prompt de imagem bem estruturado?",
                options: [
                  { letter: "A", text: '"Uma coisa bonita, legal e incrível."' },
                  { letter: "B", text: '"Retrato fotográfico de um astronauta idoso, iluminação dramática de estúdio, estilo cyberpunk, lentes 85mm, ultra detalhado."' },
                  { letter: "C", text: '"Foto de gato."' },
                  { letter: "D", text: '"Quero uma imagem que não tenha nada feio."' }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "des-mod-1-l2",
            title: "Estilos, Iluminação e Enquadramentos com IA",
            icon: "Camera",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Controlando a Atmosfera Visual"
              },
              {
                type: "text",
                text: "Mudar a iluminação ou o ângulo de uma tomada muda inteiramente o impacto emocional de uma imagem. Ao usar termos técnicos como 'golden hour' (hora de ouro), 'cinematic backlight' (luz de fundo cinematográfica) ou 'macro lens close-up' (plano detalhado com lente macro), você consegue resultados consistentes e profissionais."
              },
              {
                type: "quote",
                text: "\"Dominar a terminologia do cinema e da fotografia tradicional é o melhor atalho para se comunicar fluentemente com as IAs geradoras de arte.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que termos como 'golden hour' e 'backlight' controlam na geração de imagens?",
                options: [
                  { letter: "A", text: "O tamanho do arquivo gerado no disco." },
                  { letter: "B", text: "A qualidade e direção da iluminação na cena." },
                  { letter: "C", text: "A velocidade de conexão com a API." },
                  { letter: "D", text: "O número de cores que a tela do usuário consegue exibir." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como o uso de vocabulário técnico de fotografia afeta as gerações visuais?",
                options: [
                  { letter: "A", text: "Não causa nenhum impacto, pois a IA ignora termos fotográficos." },
                  { letter: "B", text: "Ajuda a guiar o enquadramento, textura e iluminação da imagem de maneira precisa e profissional." },
                  { letter: "C", text: "Serve apenas para deixar o prompt mais longo e lento." },
                  { letter: "D", text: "Bloqueia a imagem por ser considerada técnica avançada demais." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      },
      {
        id: "des-mod-2",
        title: "Módulo 2: UX e Interfaces Guiadas por IA",
        lessons: [
          {
            id: "des-mod-2-l1",
            title: "Prompting para Design de Interface (UI)",
            icon: "Layers",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Prototipagem Rápida de Telas"
              },
              {
                type: "text",
                text: "Utilizar ferramentas de IA para criar layouts e interfaces (UI) revolucionou o processo de descoberta de produtos. Ao descrever as necessidades dos usuários e regras de acessibilidade, você pode pedir à IA códigos em React Native, HTML/Tailwind ou estruturas que podem ser importadas diretamente no Figma."
              },
              {
                type: "quote",
                text: "\"Descreva a hierarquia de componentes e o fluxo de interação para obter estruturas de interface perfeitamente alinhadas com as diretrizes modernas de usabilidade.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual a melhor forma de gerar uma estrutura de UI usando IA?",
                options: [
                  { letter: "A", text: "Pedir para criar um site sem definir o público-alvo ou a hierarquia das informações." },
                  { letter: "B", text: "Especificar a hierarquia dos componentes, fluxo de navegação e frameworks desejados (ex: Tailwind CSS)." },
                  { letter: "C", text: "Usar apenas palavras soltas como 'bonito' e 'moderno'." },
                  { letter: "D", text: "Deixar que a IA decida até mesmo o nome da sua empresa sem sua aprovação." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como a IA acelera o processo de prototipagem rápida em UI?",
                options: [
                  { letter: "A", text: "Substituindo a necessidade de fazer testes com usuários reais permanentes." },
                  { letter: "B", text: "Gerando rascunhos de código estruturado de layouts visuais em segundos a partir de especificações textuais." },
                  { letter: "C", text: "Instalando softwares automaticamente no computador do usuário." },
                  { letter: "D", text: "Desenvolvendo hardware físico de forma mágica." }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "des-mod-2-l2",
            title: "Escrita de Microcópia (UX Writing) com LLMs",
            icon: "Pencil",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Guia de Tom e Voz para Mensagens de Interface"
              },
              {
                type: "text",
                text: "UX Writing é a prática de escrever microtextos em botões, pop-ups, estados de erro e onboarding para guiar o usuário em uma interface. Os LLMs são ótimos parceiros nessa tarefa se você treinar o modelo para adotar o tom e voz específicos de uma marca, garantindo clareza e empatia nas mensagens."
              },
              {
                type: "quote",
                text: "\"Defina as diretrizes no prompt: 'Escreva um texto de erro de pagamento que seja explicativo, sem termos técnicos assustadores e de tom prestativo'.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que é microcópia (UX Writing)?",
                options: [
                  { letter: "A", text: "O ato de copiar textos minúsculos em livros didáticos." },
                  { letter: "B", text: "Os textos curtos presentes nas interfaces, como botões, mensagens de erro e guias, que ajudam na navegação do usuário." },
                  { letter: "C", text: "A programação de chips de memória microscópicos." },
                  { letter: "D", text: "O envio de spam de e-mails em massa." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como configurar um LLM para criar uma boa microcópia?",
                options: [
                  { letter: "A", text: "Pedindo para a IA gerar o texto mais longo e prolixo possível." },
                  { letter: "B", text: "Definindo de antemão o tom da marca, a clareza exigida e o contexto específico de uso do botão ou erro." },
                  { letter: "C", text: "Dizendo apenas para a IA escrever de forma aleatória." },
                  { letter: "D", text: "Substituindo todas as palavras por jargões jurídicos confusos." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      }
    ]
  },
  "prompt-science": {
    id: "prompt-science",
    title: "Prompt Science",
    modules: [
      {
        id: "ps-mod-1",
        title: "Módulo 1: Fundamentos Científicos do Prompting",
        lessons: [
          {
            id: "ps-mod-1-l1",
            title: "Como os LLMs Processam Texto (Tokens e Probabilidades)",
            icon: "Cpu",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "A Ciência por Trás da Geração de Palavras"
              },
              {
                type: "text",
                text: "Os computadores não entendem palavras diretamente. Em vez disso, os LLMs quebram textos de entrada em fragmentos chamados tokens. Um token pode ser uma palavra inteira, uma sílaba ou apenas alguns caracteres. Compreender o funcionamento da tokenização é vital, pois você paga por token consumido e a janela de memória do modelo é estritamente limitada por este fator."
              },
              {
                type: "quote",
                text: "\"Cada token processado passa por bilhões de cálculos matriciais em frações de segundo para calcular a distribuição de probabilidade da próxima palavra.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que é um 'token' no contexto de LLMs?",
                options: [
                  { letter: "A", text: "Uma moeda digital de cripto utilizada para pagar as empresas de IA." },
                  { letter: "B", text: "O menor fragmento de texto (caractere, sílaba ou palavra) que o modelo processa internamente." },
                  { letter: "C", text: "Uma chave física de segurança para conectar no servidor." },
                  { letter: "D", text: "Um bug que faz o modelo de linguagem parar de funcionar." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Por que a tokenização afeta os custos e as restrições operacionais da IA?",
                options: [
                  { letter: "A", text: "Porque os tokens aumentam a velocidade da internet física." },
                  { letter: "B", text: "Porque o faturamento das APIs e a limitação de memória (janela de contexto) baseiam-se na contagem de tokens processados." },
                  { letter: "C", text: "Porque os tokens convertem os arquivos para arquivos PDF." },
                  { letter: "D", text: "Porque o modelo fica com ciúmes quando usamos muitos tokens." }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "ps-mod-1-l2",
            title: "Temperatura, Top-P e Parâmetros de Decodificação",
            icon: "Sliders",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Ajustando o Nível de Criatividade e Determinismo"
              },
              {
                type: "text",
                text: "Ao interagir com APIs de LLM, você pode ajustar parâmetros como 'Temperatura' e 'Top-P'. A Temperatura controla o nível de aleatoriedade das previsões de palavras. Um valor próximo a 0 torna a resposta determinística e factual (ótimo para matemática e lógica), enquanto valores próximos a 1 tornam o texto criativo e altamente variável."
              },
              {
                type: "quote",
                text: "\"Ajustar a Temperatura para zero diminui drasticamente a variabilidade das saídas, sendo a melhor configuração para tarefas técnicas repetíveis.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que acontece ao definir a Temperatura em 0 (zero) em uma chamada de API?",
                options: [
                  { letter: "A", text: "A resposta será extremamente criativa e imprevisível." },
                  { letter: "B", text: "A resposta será altamente determinística, factual e repetível." },
                  { letter: "C", text: "O modelo entrará em modo de suspensão de energia." },
                  { letter: "D", text: "O custo financeiro da chamada será duplicado imediatamente." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual configuração de temperatura seria ideal para escrever um poema inédito?",
                options: [
                  { letter: "A", text: "Temperatura 0.0" },
                  { letter: "B", text: "Temperatura 0.8 a 1.0 (maior aleatoriedade e criatividade)" },
                  { letter: "C", text: "Temperatura negativa" },
                  { letter: "D", text: "Manter o computador desligado" }
                ],
                correct: "B"
              }
            ]
          }
        ]
      },
      {
        id: "ps-mod-2",
        title: "Módulo 2: Mecanismos de Atenção e Contexto",
        lessons: [
          {
            id: "ps-mod-2-l1",
            title: "O Mecanismo de Atenção (Transformers)",
            icon: "Brain",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "A Revolução do Self-Attention"
              },
              {
                type: "text",
                text: "O avanço revolucionário que possibilitou a existência do ChatGPT foi o mecanismo de auto-atenção (Self-Attention) introduzido na arquitetura Transformer em 2017. Ele permite que o modelo pese dinamicamente a importância de cada palavra em relação a todas as outras na mesma frase, independentemente da distância física entre elas."
              },
              {
                type: "quote",
                text: "\"No exemplo 'O banco do rio estava molhado', a palavra 'rio' ajuda a IA a prestar atenção na semântica correta de 'banco' (margem da água, e não instituição financeira).\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que o mecanismo de Self-Attention permite que um Transformer faça?",
                options: [
                  { letter: "A", text: "Desligar partes do computador que não estão sendo usadas." },
                  { letter: "B", text: "Relacionar e pesar dinamicamente a importância de palavras distantes na frase para entender melhor o significado global." },
                  { letter: "C", text: "Apenas ler textos em inglês." },
                  { letter: "D", text: "Garantir que a IA nunca cometa erros ortográficos." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual artigo acadêmico de 2017 popularizou o mecanismo de Atenção e os Transformers?",
                options: [
                  { letter: "A", text: '"Attention Is All You Need" por pesquisadores do Google.' },
                  { letter: "B", text: '"A Mathematical Theory of Communication" por Claude Shannon.' },
                  { letter: "C", text: '"Computing Machinery and Intelligence" por Alan Turing.' },
                  { letter: "D", text: '"Deep Learning inside Networks".' }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "ps-mod-2-l2",
            title: "Gerenciamento do Tamanho da Janela de Contexto",
            icon: "BookOpen",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Lidando com Limites de Memória das IAs"
              },
              {
                type: "text",
                text: "A janela de contexto representa a quantidade total de tokens que um modelo consegue reter na memória de trabalho em uma única chamada. Se o seu prompt ultrapassar esse limite, o LLM esquecerá as partes iniciais da conversa. Por isso, gerenciar o tamanho do contexto e resumir históricos de chats de forma eficiente é crucial para aplicações estáveis de longa duração."
              },
              {
                type: "quote",
                text: "\"Conforme o chat se alonga, criar resumos consolidados é a melhor técnica para não estourar os limites da janela de contexto do modelo.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que acontece se uma conversa de chat exceder o limite da janela de contexto de um modelo?",
                options: [
                  { letter: "A", text: "O modelo apaga automaticamente todo o sistema operacional do servidor." },
                  { letter: "B", text: "A IA começa a ignorar e esquecer as informações mais antigas da conversa." },
                  { letter: "C", text: "O aplicativo cobra R$100 do cartão cadastrado automaticamente." },
                  { letter: "D", text: "A IA desliga temporariamente os servidores por 24 horas." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual é uma técnica eficiente para manter conversas muito longas ativas sem estourar o contexto?",
                options: [
                  { letter: "A", text: "Repetir o prompt inicial a cada nova linha." },
                  { letter: "B", text: "Fazer o modelo gerar e atualizar resumos periódicos das principais decisões da conversa." },
                  { letter: "C", text: "Usar apenas letras maiúsculas." },
                  { letter: "D", text: "Substituir todas as palavras por emojis." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      }
    ]
  },
  "prompt-engineering": {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    modules: [
      {
        id: "pe-mod-1",
        title: "Módulo 1: Técnicas Clássicas de Prompting",
        lessons: [
          {
            id: "pe-mod-1-l1",
            title: "Zero-Shot vs Few-Shot Learning",
            icon: "Lightbulb",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Aprendizado por Exemplo"
              },
              {
                type: "text",
                text: "A maneira mais direta de instruir um modelo de linguagem é o Zero-Shot Prompting, onde você pede para o modelo realizar uma tarefa sem mostrar exemplos anteriores. No entanto, em tarefas complexas de categorização ou formatação estrita, o Few-Shot Prompting (fornecer 1 ou mais exemplos estruturados de entrada e saída esperada) garante uma fidelidade drástica na entrega."
              },
              {
                type: "quote",
                text: "\"Few-shot é o segredo de ouro para fazer a IA entender o formato estrito de saída JSON que seu código exige, sem a necessidade de processamento pós-geração.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a principal diferença entre Zero-Shot e Few-Shot Prompting?",
                options: [
                  { letter: "A", text: "Zero-shot é feito em computadores antigos; Few-shot usa computação quântica." },
                  { letter: "B", text: "Zero-shot faz a pergunta diretamente sem exemplos; Few-shot fornece exemplos reais do padrão esperado." },
                  { letter: "C", text: "Few-shot exige pagamento extra por chamada." },
                  { letter: "D", text: "Não há diferença prática de acurácia entre eles." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Quando o uso de Few-Shot Prompting é especialmente recomendado?",
                options: [
                  { letter: "A", text: "Para tarefas simples que qualquer modelo resolve diretamente." },
                  { letter: "B", text: "Quando você precisa que a IA gere dados formatados seguindo um padrão estrito e personalizado." },
                  { letter: "C", text: "Quando você quer diminuir o número de tokens enviados no prompt." },
                  { letter: "D", text: "Para economizar o tempo de processamento." }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "pe-mod-1-l2",
            title: "Chain-of-Thought (CoT) e Raciocínio Lógico",
            icon: "HelpCircle",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "A Decomposição Passo a Passo"
              },
              {
                type: "text",
                text: "Modelos de linguagem cometem erros em problemas lógicos simples por tentarem prever a palavra final instantaneamente. A técnica Chain-of-Thought (CoT - Cadeia de Pensamento) resolve isso instruindo o modelo a detalhar seu raciocínio passo a passo antes de apresentar a conclusão."
              },
              {
                type: "quote",
                text: "\"Adicionar simplesmente a frase 'Pense passo a passo e explique seu raciocínio' ativa um comportamento de encadeamento lógico que reduz alucinações e erros matemáticos complexos.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Por que a técnica Chain-of-Thought melhora as respostas lógicas dos LLMs?",
                options: [
                  { letter: "A", text: "Ela acelera a velocidade física do hardware no servidor da IA." },
                  { letter: "B", text: "Ela força o modelo a gerar tokens que servem como rascunhos para embasar a resposta final lógica." },
                  { letter: "C", text: "Ela deleta os dados incorretos da internet." },
                  { letter: "D", text: "Ela traduz o prompt para Python secretamente." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual comando em português costuma ativar o comportamento CoT de forma implícita?",
                options: [
                  { letter: "A", text: '"Escreva o mais rápido possível."' },
                  { letter: "B", text: '"Pense passo a passo antes de dar a resposta final e justifique cada etapa."' },
                  { letter: "C", text: '"Dê apenas a resposta final e nada mais."' },
                  { letter: "D", text: '"Não tente pensar."' }
                ],
                correct: "B"
              }
            ]
          }
        ]
      },
      {
        id: "pe-mod-2",
        title: "Módulo 2: Técnicas Avançadas de Prompting",
        lessons: [
          {
            id: "pe-mod-2-l1",
            title: "ReAct (Reasoning and Acting)",
            icon: "Zap",
            duration: "17 min",
            content: [
              {
                type: "heading",
                text: "Unindo Raciocínio Lógico com Ações Externas"
              },
              {
                type: "text",
                text: "A técnica ReAct (Raciocínio + Ação) permite que o modelo decida quando precisa buscar informações externas. Ele gera um ciclo estruturado de 'Pensamento', 'Ação' (como buscar informações no Google ou consultar uma API de clima) e 'Observação' (processar o resultado da ação) antes de formular a resposta final para o usuário."
              },
              {
                type: "quote",
                text: "\"O framework ReAct serve como base para a imensa maioria dos agentes e assistentes de IA avançados da atualidade.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual é a base do funcionamento do framework ReAct?",
                options: [
                  { letter: "A", text: "Reagir com raiva quando o usuário faz perguntas repetitivas." },
                  { letter: "B", text: "Alternar continuamente entre etapas de raciocínio (Pensamento) e ações externas (Ação) para resolver o problema." },
                  { letter: "C", text: "Desativar APIs de terceiros para forçar o modelo a chutar a resposta." },
                  { letter: "D", text: "Apenas reescrever o código do usuário em Java." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "O que constitui a etapa de 'Observação' em um fluxo ReAct?",
                options: [
                  { letter: "A", text: "A resposta ou dado retornado por uma ferramenta externa após a IA ter executado uma Ação." },
                  { letter: "B", text: "O usuário olhando para a tela esperando a resposta." },
                  { letter: "C", text: "O tempo que a API leva para conectar." },
                  { letter: "D", text: "Uma câmera de vídeo analisando a expressão facial do usuário." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "pe-mod-2-l2",
            title: "Meta-Prompting e Auto-Refinamento",
            icon: "Award",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "IAs Criando Prompts para IAs"
              },
              {
                type: "text",
                text: "Por que quebrar a cabeça escrevendo prompts se os próprios modelos de linguagem são excelentes engenheiros de prompts? O Meta-Prompting consiste em instruir uma IA a redigir, otimizar e testar o prompt final ideal que você utilizará em outra aplicação ou tarefa do dia a dia."
              },
              {
                type: "quote",
                text: "\"Escreva um meta-prompt instruindo a IA: 'Aja como um designer instrucional sênior e crie um prompt para gerar planos de aula eficazes'.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que é Meta-Prompting?",
                options: [
                  { letter: "A", text: "Desenvolver prompts específicos apenas para a empresa controladora do Facebook." },
                  { letter: "B", text: "Usar um LLM para gerar, refinar ou otimizar outros prompts de forma sistemática." },
                  { letter: "C", text: "Uma técnica antiga para deletar dados corrompidos." },
                  { letter: "D", text: "Apenas um prompt muito curto com palavras de baixo calão." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual é o principal benefício do auto-refinamento de prompts por IA?",
                options: [
                  { letter: "A", text: "Acelerar a velocidade de carregamento da internet." },
                  { letter: "B", text: "Encontrar e corrigir falhas semânticas ou ambiguidades de forma automatizada e ágil." },
                  { letter: "C", text: "Diminuir o número de servidores necessários para rodar um prompt." },
                  { letter: "D", text: "Obter patentes intelectuais mais rápidas." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      }
    ]
  },
  "advanced-science": {
    id: "advanced-science",
    title: "Advanced Science",
    modules: [
      {
        id: "as-mod-1",
        title: "Módulo 1: RAG e Sistemas Híbridos",
        lessons: [
          {
            id: "as-mod-1-l1",
            title: "O que é RAG (Retrieval-Augmented Generation)?",
            icon: "Database",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Alimentando a IA com Conhecimento Externo e Dinâmico"
              },
              {
                type: "text",
                text: "Mesmo as maiores IAs possuem dados desatualizados ou desconhecem arquivos internos de empresas privadas. O RAG (Geração Aumentada de Recuperação) corrige isso pesquisando documentos externos correspondentes à pergunta do usuário e acoplando essas informações no prompt da IA como contexto factual temporário."
              },
              {
                type: "quote",
                text: "\"Com o RAG, a IA funciona como um estudante que faz uma prova com consulta aos livros corretos colocados sobre sua mesa.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que a sigla RAG significa?",
                options: [
                  { letter: "A", text: "Random Access Generation (Geração de Acesso Aleatório)." },
                  { letter: "B", text: "Retrieval-Augmented Generation (Geração Aumentada de Recuperação)." },
                  { letter: "C", text: "Real-time Action Grid (Grade de Ação em Tempo Real)." },
                  { letter: "D", text: "Recurrent Autonomous Gateway (Portal Autônomo Recorrente)." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual o principal benefício da arquitetura RAG?",
                options: [
                  { letter: "A", text: "Evitar treinar ou re-treinar o modelo completo fornecendo dados factuais e privados atualizados em tempo de execução." },
                  { letter: "B", text: "Reduzir o consumo de bateria do servidor para zero." },
                  { letter: "C", text: "Eliminar a necessidade de usar prompts no chat." },
                  { letter: "D", text: "Permitir que a IA se comunique por sinais de fumaça." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "as-mod-1-l2",
            title: "Bancos de Dados Vetoriais e Embeddings",
            icon: "Network",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "A Matemática da Semelhança Semântica"
              },
              {
                type: "text",
                text: "Para que o sistema RAG encontre o documento certo, os textos são convertidos em vetores de números conhecidos como 'embeddings'. Esses vetores localizam conceitos em um espaço multidimensional. Textos que possuem significados parecidos (como 'cachorro' e 'cão') ficam geometricamente próximos nesse espaço, facilitando a busca."
              },
              {
                type: "quote",
                text: "\"Os bancos de dados vetoriais (como Pinecone, Chroma ou Milvus) são otimizados para encontrar rapidamente estes vetores vizinhos mais próximos.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que são 'embeddings' no contexto de inteligência artificial?",
                options: [
                  { letter: "A", text: "Legendas embutidas nas imagens criadas por modelos de difusão." },
                  { letter: "B", text: "Representações matemáticas vetoriais que capturam o significado semântico de palavras ou textos." },
                  { letter: "C", text: "Fontes tipográficas especiais para terminais de programador." },
                  { letter: "D", text: "Placas de circuito impresso para supercomputadores." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Para que serve um banco de dados vetorial?",
                options: [
                  { letter: "A", text: "Apenas para salvar backups em formato de planilha de Excel clássica." },
                  { letter: "B", text: "Para realizar pesquisas de similaridade geométrica ultrarrápidas entre vetores (embeddings)." },
                  { letter: "C", text: "Para criptografar as senhas das redes sociais dos usuários." },
                  { letter: "D", text: "Para substituir completamente os servidores de nuvem por discos físicos." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      },
      {
        id: "as-mod-2",
        title: "Módulo 2: Agentes Autônomos e Multiagentes",
        lessons: [
          {
            id: "as-mod-2-l1",
            title: "Arquitetura de Agentes Autônomos (Loop de Ação)",
            icon: "PlayCircle",
            duration: "18 min",
            content: [
              {
                type: "heading",
                text: "IAs que Executam Planos sem Supervisão Direta"
              },
              {
                type: "text",
                text: "Diferente de um chat comum que depende de perguntas a cada etapa, os agentes autônomos recebem um objetivo principal complexo (ex: 'pesquise concorrentes do produto X e crie um slide comparativo'). A IA então se desdobra em sub-tarefas e decide de forma autônoma quais ferramentas usar."
              },
              {
                type: "quote",
                text: "\"Agentes necessitam de três pilares: Planejamento (decomposição do objetivo), Memória (retenção de estados passados) e Ferramentas (APIs para agir).\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Quais são as três fundações de um agente autônomo baseado em LLMs?",
                options: [
                  { letter: "A", text: "Planejamento, Memória e Ferramentas (Tools)." },
                  { letter: "B", text: "Teclado, Mouse e Monitor de Alta Resolução." },
                  { letter: "C", text: "JavaScript, HTML e CSS." },
                  { letter: "D", text: "Login, Cadastro e Redefinição de senha." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "Como o agente autônomo opera para realizar um grande objetivo?",
                options: [
                  { letter: "A", text: "Ele desiste imediatamente ao encontrar o primeiro erro lógico." },
                  { letter: "B", text: "Ele divide o objetivo maior em tarefas menores, executa-as ciclicamente e avalia seu próprio progresso." },
                  { letter: "C", text: "Ele pede dinheiro ao usuário para comprar as informações prontas." },
                  { letter: "D", text: "Ele gera código criptografado que ninguém consegue decifrar." }
                ],
                correct: "B"
              }
            ]
          },
          {
            id: "as-mod-2-l2",
            title: "Colaboração de Multiagentes",
            icon: "Workflow",
            duration: "17 min",
            content: [
              {
                type: "heading",
                text: "Equipes Virtuais Trabalhando Juntas"
              },
              {
                type: "text",
                text: "Ao invés de usar apenas um agente generalista, as soluções mais avançadas utilizam múltiplos agentes com especialidades diferentes conversando entre si. Um agente atua como Gerente de Produto, outro como Desenvolvedor e outro como Analista de Qualidade, gerando um resultado de alto padrão e auto-corrigido."
              },
              {
                type: "quote",
                text: "\"Ao definir papéis opostos para agentes diferentes (como escritor e editor crítico), a qualidade final do texto gerado aumenta exponencialmente.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que caracteriza um sistema de Colaboração Multiagente?",
                options: [
                  { letter: "A", text: "Várias pessoas humanas digitando no mesmo chat ao mesmo tempo." },
                  { letter: "B", text: "Múltiplos agentes de IA com papéis específicos colaborando e revisando o trabalho uns dos outros." },
                  { letter: "C", text: "A clonagem física de computadores em rede local." },
                  { letter: "D", text: "A fusão de vários modelos em apenas um grande arquivo binário unificado." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual a vantagem de colocar um agente no papel de 'Escritor' e outro no de 'Editor Crítico'?",
                options: [
                  { letter: "A", text: "Fazer o modelo demorar mais para responder de propósito." },
                  { letter: "B", text: "Otimizar o custo da computação." },
                  { letter: "C", text: "Gerar um ciclo saudável de revisão e aprimoramento que corrige erros e eleva o nível do resultado final." },
                  { letter: "D", text: "Excluir automaticamente qualquer palavra repetida da resposta." }
                ],
                correct: "C"
              }
            ]
          }
        ]
      }
    ]
  },
  "hour-of-focus": {
    id: "hour-of-focus",
    title: "Hour of Focus",
    modules: [
      {
        id: "hof-mod-1",
        title: "Módulo 1: Produtividade Extrema com IA",
        lessons: [
          {
            id: "hof-mod-1-l1",
            title: "Técnicas de Resumo e Síntese de Grandes Volumes",
            icon: "BookOpen",
            duration: "10 min",
            content: [
              {
                type: "heading",
                text: "Engolindo Conhecimento com Inteligência"
              },
              {
                type: "text",
                text: "Em um mundo repleto de informação, o tempo é o recurso mais valioso. Aprenda a programar prompts de compressão que extraem insights práticos de PDFs de 100 páginas ou de transcrições de reuniões de duas horas em menos de 30 segundos, sem perder as decisões essenciais."
              },
              {
                type: "quote",
                text: "\"Definir o público-alvo do resumo evita que a IA remova detalhes que parecem técnicos para um leigo, mas que são fundamentais para o especialista.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual técnica otimiza o resumo de um relatório corporativo complexo feito por um LLM?",
                options: [
                  { letter: "A", text: "Pedir um resumo curto sem fornecer o contexto ou o público-alvo interessado." },
                  { letter: "B", text: "Especificar o público-alvo (ex: diretores, engenheiros) e definir restrições estruturais claras (ex: metas, riscos)." },
                  { letter: "C", text: "Copiar e colar o texto várias vezes para confundir a IA." },
                  { letter: "D", text: "Usar apenas palavras isoladas no prompt." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Como evitar que a IA filtre dados cruciais ao resumir textos longos?",
                options: [
                  { letter: "A", text: "Indicando claramente no prompt quais tópicos de interesse (ex: orçamentos, cronogramas) não podem ser excluídos de forma alguma." },
                  { letter: "B", text: "Não há como evitar, a IA resume conforme quer." },
                  { letter: "C", text: "Pedindo para que a IA reescreva o texto sem resumir nada." },
                  { letter: "D", text: "Usar uma fonte tipográfica diferente." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "hof-mod-1-l2",
            title: "Análise de Dados e Relatórios Gerenciais Rápidos",
            icon: "BarChart3",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Transformando Tabelas em Narrativas de Sucesso"
              },
              {
                type: "text",
                text: "A capacidade de ler números puros e encontrar histórias neles é crucial para líderes modernos. Fornecendo tabelas brutas no formato CSV ou JSON para um LLM, você pode instruí-lo a extrair anomalias, picos de venda, falhas de funil e sugerir planos de ação prontos para apresentação corporativa."
              },
              {
                type: "quote",
                text: "\"Instrua a IA a separar as observações analíticas (o que os números mostram) das sugestões estratégicas (o que a empresa deve fazer a respeito).\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Como os LLMs auxiliam na análise de arquivos CSV ou tabelas estruturadas?",
                options: [
                  { letter: "A", text: "Eles reescrevem o arquivo no banco de dados físico de forma invisível." },
                  { letter: "B", text: "Eles identificam padrões, anomalias e transformam números em conclusões textuais fáceis de entender." },
                  { letter: "C", text: "Eles apenas calculam médias aritméticas básicas mais lentas que o Excel." },
                  { letter: "D", text: "Eles compram ações do mercado financeiro de forma oculta." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual a melhor recomendação para estruturar um prompt de análise de dados gerenciais?",
                options: [
                  { letter: "A", text: "Misturar observações brutas com opiniões subjetivas na mesma frase longa." },
                  { letter: "B", text: "Pedir à IA para separar estritamente dados descritivos factuais (o quê) de propostas de soluções práticas (o que fazer)." },
                  { letter: "C", text: "Não enviar os dados, apenas descrever as cores das planilhas." },
                  { letter: "D", text: "Pedir opiniões aleatórias." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      },
      {
        id: "hof-mod-2",
        title: "Módulo 2: Foco e Resolução de Problemas",
        lessons: [
          {
            id: "hof-mod-2-l1",
            title: "Brainstorming Estruturado e Exploração de Cenários",
            icon: "Lightbulb",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Multiplicando as Suas Ideias Iniciais"
              },
              {
                type: "text",
                text: "Os LLMs são fantásticos para gerar ideias por possuírem referências de milhares de setores diferentes. No entanto, sessões de brainstorming sem estrutura geram respostas repetitivas. Configure papéis específicos como 'advogado do diabo' ou 'usuário cético' para testar a robustez dos seus planos e antecipar falhas de mercado."
              },
              {
                type: "quote",
                text: "\"Use a IA para desafiar suas hipóteses mais queridas. O melhor brainstorming é aquele que revela os seus pontos cegos profissionais.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "Como evitar ideias genéricas em sessões de brainstorming com IAs?",
                options: [
                  { letter: "A", text: "Fazendo perguntas genéricas como 'me dê ideias legais'." },
                  { letter: "B", text: "Instruindo o modelo a adotar papéis específicos de teste (ex: advogado do diabo) e restringindo os nichos de atuação." },
                  { letter: "C", text: "Mudando o idioma para latim." },
                  { letter: "D", text: "Deixando que o prompt seja formulado por um bot de spam." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual o maior benefício de usar IA como testadora de hipóteses corporativas?",
                options: [
                  { letter: "A", text: "Revelar de forma rápida pontos cegos, fraquezas de lógica e antecipar cenários alternativos de mercado." },
                  { letter: "B", text: "Garantir lucros bilionários automáticos sem esforço." },
                  { letter: "C", text: "Reduzir o tamanho físico do time de executivos para apenas um estagiário." },
                  { letter: "D", text: "Substituir a tomada de decisão final dos proprietários da empresa." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "hof-mod-2-l2",
            title: "Refatoração Mental e Tomada de Decisão Decisiva",
            icon: "CheckCircle",
            duration: "11 min",
            content: [
              {
                type: "heading",
                text: "Organizando Ideias Confusas sob Pressão"
              },
              {
                type: "text",
                text: "Quando você está lidando com crises ou bloqueios intelectuais, o excesso de informação pode paralisar sua tomada de decisão. Faça um despejo mental rápido digitando todas as suas preocupações sem ordem no prompt e instrua a IA a organizar a confusão em uma matriz de priorização de tarefas urgente e executável."
              },
              {
                type: "quote",
                text: "\"O despejo de ideias bagunçadas (braindump) combinado com técnicas de categorização automática limpa a mente e direciona o foco imediato para as ações de alto impacto.\""
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que é a técnica de 'braindump' (despejo mental) estruturada por IA?",
                options: [
                  { letter: "A", text: "Fazer o backup do computador na nuvem pública sem restrições." },
                  { letter: "B", text: "Digitar ideias e preocupações de forma bagunçada e pedir para a IA categorizá-las em um plano de ação estruturado e lógico." },
                  { letter: "C", text: "Apagar todas as memórias do chat para limpar os dados." },
                  { letter: "D", text: "Deixar a IA controlar seus canais de chat pessoais de forma autônoma." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual a melhor matriz para instruir a IA a usar na organização das tarefas priorizadas?",
                options: [
                  { letter: "A", text: "Matriz de cores aleatórias." },
                  { letter: "B", text: "Matriz de Eisenhower (Urgente vs Importante) ou Matriz de Esforço vs Impacto." },
                  { letter: "C", text: "Não usar matriz alguma, apenas uma lista gigante desordenada." },
                  { letter: "D", text: "Apenas agrupar tudo em uma única pasta sem critérios de triagem." }
                ],
                correct: "B"
              }
            ]
          }
        ]
      }
    ]
  },
  "agent-orchestration": {
    id: "agent-orchestration",
    title: "Orquestracao de Agentes",
    modules: [
      {
        id: "ao-mod-1",
        title: "Modulo 1: Sistemas com Agentes de IA",
        lessons: [
          {
            id: "ao-mod-1-l1",
            title: "Do Chatbot ao Agente Executor",
            icon: "Bot",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Agentes trabalham com objetivo, memoria e ferramentas"
              },
              {
                type: "text",
                text: "Um chatbot responde a uma mensagem. Um agente recebe um objetivo, divide o trabalho em etapas, consulta ferramentas e revisa o proprio progresso. Essa mudanca permite automatizar tarefas como pesquisar, comparar opcoes, gerar documentos e validar resultados antes de devolver a resposta final."
              },
              {
                type: "quote",
                text: "\"Um bom agente nao e uma IA solta: e um fluxo com papel claro, limites, ferramentas autorizadas e criterio de parada.\""
              },
              {
                type: "text",
                text: "Para criar agentes confiaveis, defina: papel, objetivo, contexto, ferramentas permitidas, formato de saida e regras de escalonamento quando houver incerteza."
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que diferencia um agente de IA de um chatbot simples?",
                options: [
                  { letter: "A", text: "O agente sempre usa uma tela maior." },
                  { letter: "B", text: "O agente pode planejar etapas, usar ferramentas e avaliar progresso rumo a um objetivo." },
                  { letter: "C", text: "O agente nao precisa de nenhum limite ou instrucao." },
                  { letter: "D", text: "O agente funciona apenas sem internet." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Qual item deve existir em um desenho seguro de agente?",
                options: [
                  { letter: "A", text: "Ferramentas autorizadas e criterio claro de parada." },
                  { letter: "B", text: "Permissao para executar qualquer acao sem revisao." },
                  { letter: "C", text: "Objetivos vagos para deixar a IA improvisar." },
                  { letter: "D", text: "Ausencia total de logs." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "ao-mod-1-l2",
            title: "Orquestracao Multiagente",
            icon: "Workflow",
            duration: "16 min",
            content: [
              {
                type: "heading",
                text: "Especialistas pequenos vencem generalistas confusos"
              },
              {
                type: "text",
                text: "Orquestrar agentes significa dividir um trabalho complexo em papeis menores. Um agente pesquisador coleta evidencias, um analista estrutura hipoteses, um revisor procura falhas e um coordenador consolida a resposta. O ganho aparece quando cada papel tem responsabilidade e saida bem definida."
              },
              {
                type: "quote",
                text: "\"Multiagente nao e colocar varias IAs conversando sem direcao; e desenhar uma linha de montagem cognitiva.\""
              },
              {
                type: "text",
                text: "O coordenador deve evitar duplicidade, resolver conflitos entre agentes e pedir nova rodada apenas quando a evidencia for insuficiente."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual e a funcao de um agente coordenador?",
                options: [
                  { letter: "A", text: "Ignorar todos os especialistas." },
                  { letter: "B", text: "Consolidar resultados, resolver conflitos e decidir se nova rodada e necessaria." },
                  { letter: "C", text: "Fazer apenas design visual." },
                  { letter: "D", text: "Apagar evidencias divergentes." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Quando sistemas multiagente trazem mais valor?",
                options: [
                  { letter: "A", text: "Quando tarefas exigem pesquisa, analise, revisao e consolidacao com papeis diferentes." },
                  { letter: "B", text: "Quando a tarefa e responder uma pergunta de uma palavra." },
                  { letter: "C", text: "Quando nao existe criterio de qualidade." },
                  { letter: "D", text: "Quando todos os agentes fazem exatamente a mesma coisa." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      }
    ]
  },
  "ai-finance": {
    id: "ai-finance",
    title: "IA para Financeiro",
    modules: [
      {
        id: "fin-mod-1",
        title: "Modulo 1: Analise Financeira com IA",
        lessons: [
          {
            id: "fin-mod-1-l1",
            title: "Leitura de Fluxo de Caixa com IA",
            icon: "LineChart",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Transformando numeros em decisoes"
              },
              {
                type: "text",
                text: "A IA pode ajudar a ler extratos, tabelas e categorias de despesas para encontrar padroes: sazonalidade, gastos recorrentes, gargalos de caixa e sinais de risco. O papel da IA nao e substituir o financeiro, mas acelerar a leitura e tornar as perguntas melhores."
              },
              {
                type: "quote",
                text: "\"Separe observacao factual de recomendacao: primeiro o que os dados mostram, depois o que fazer.\""
              },
              {
                type: "text",
                text: "Um bom prompt financeiro pede periodo analisado, categorias, limites, premissas e formato de saida com alertas, oportunidades e proximas acoes."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual e uma boa forma de usar IA em fluxo de caixa?",
                options: [
                  { letter: "A", text: "Pedir para inventar saldos sem dados." },
                  { letter: "B", text: "Identificar padroes, recorrencias, riscos e oportunidades a partir de dados fornecidos." },
                  { letter: "C", text: "Substituir conciliacao bancaria sem conferencia." },
                  { letter: "D", text: "Ignorar premissas e periodo analisado." }
                ],
                correct: "B"
              },
              {
                id: 2,
                question: "Por que separar fatos de recomendacoes em analises financeiras?",
                options: [
                  { letter: "A", text: "Para deixar claro o que veio dos dados e o que e sugestao de acao." },
                  { letter: "B", text: "Para esconder erros." },
                  { letter: "C", text: "Para aumentar o tamanho do relatorio sem motivo." },
                  { letter: "D", text: "Para impedir revisao humana." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "fin-mod-1-l2",
            title: "Cenarios, Orcamento e Risco",
            icon: "ShieldCheck",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Simular antes de decidir"
              },
              {
                type: "text",
                text: "Com IA, voce pode testar cenarios como queda de receita, aumento de custos, inadimplencia ou contratacao de uma nova ferramenta. O modelo ajuda a estruturar hipoteses e explicar impacto, mas os numeros finais devem ser conferidos em planilha ou sistema financeiro."
              },
              {
                type: "quote",
                text: "\"Cenario financeiro bom sempre mostra premissas, faixa de variacao e risco de erro.\""
              },
              {
                type: "text",
                text: "Use prompts que peçam melhor caso, caso base e pior caso, incluindo gatilhos de decisao e indicadores que devem ser monitorados."
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que um bom cenario financeiro deve explicitar?",
                options: [
                  { letter: "A", text: "Premissas, variacoes, impacto e risco de erro." },
                  { letter: "B", text: "Apenas uma previsao otimista." },
                  { letter: "C", text: "Somente opinioes sem dados." },
                  { letter: "D", text: "Resultados sem possibilidade de revisao." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "Qual cuidado e essencial ao usar IA para orcamento?",
                options: [
                  { letter: "A", text: "Conferir os numeros finais em fonte financeira confiavel." },
                  { letter: "B", text: "Aceitar qualquer resultado sem validar." },
                  { letter: "C", text: "Nunca informar premissas." },
                  { letter: "D", text: "Misturar moedas e periodos." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      }
    ]
  },
  "ai-marketing": {
    id: "ai-marketing",
    title: "IA para Marketing",
    modules: [
      {
        id: "mkt-mod-1",
        title: "Modulo 1: Estrategia e Conteudo com IA",
        lessons: [
          {
            id: "mkt-mod-1-l1",
            title: "Pesquisa de Publico e Persona",
            icon: "Target",
            duration: "12 min",
            content: [
              {
                type: "heading",
                text: "Marketing bom comeca com pergunta boa"
              },
              {
                type: "text",
                text: "A IA ajuda a transformar entrevistas, reviews, comentarios e dados de CRM em segmentos de publico. Ela pode identificar dores, desejos, objeções, linguagem do cliente e momentos de decisao. Quanto mais real for a entrada, menos generica sera a persona."
              },
              {
                type: "quote",
                text: "\"Persona gerada sem evidencia vira personagem. Persona gerada com dados vira ferramenta de decisao.\""
              },
              {
                type: "text",
                text: "Peça para a IA citar evidencias, separar segmentos e listar mensagens que devem ser testadas em campanha."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Qual entrada melhora muito a criacao de personas com IA?",
                options: [
                  { letter: "A", text: "Comentarios reais, entrevistas, reviews e dados de CRM." },
                  { letter: "B", text: "Apenas pedir uma persona generica." },
                  { letter: "C", text: "Nao informar produto nem publico." },
                  { letter: "D", text: "Usar somente slogans prontos." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "O que diferencia persona util de personagem inventado?",
                options: [
                  { letter: "A", text: "Evidencia concreta que sustenta dores, desejos e linguagem." },
                  { letter: "B", text: "Nome bonito e foto ilustrativa." },
                  { letter: "C", text: "Texto longo sem dados." },
                  { letter: "D", text: "Uso de termos tecnicos sem aplicacao." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "mkt-mod-1-l2",
            title: "Campanhas, Copy e Testes A/B",
            icon: "Megaphone",
            duration: "14 min",
            content: [
              {
                type: "heading",
                text: "Criatividade com criterio"
              },
              {
                type: "text",
                text: "A IA pode gerar anuncios, emails, landing pages e variações de copy rapidamente. O valor aparece quando cada versao testa uma hipotese clara: preco, urgencia, prova social, dor principal, beneficio ou garantia."
              },
              {
                type: "quote",
                text: "\"Nao teste dez frases aleatorias. Teste dez hipoteses de comportamento.\""
              },
              {
                type: "text",
                text: "Um prompt de campanha deve incluir canal, publico, oferta, objeções, tom de voz, restricoes legais e metrica principal de sucesso."
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que uma boa variacao de teste A/B deve mudar?",
                options: [
                  { letter: "A", text: "Uma hipotese clara, como beneficio principal ou prova social." },
                  { letter: "B", text: "Tudo ao mesmo tempo sem criterio." },
                  { letter: "C", text: "Apenas cor de fundo sempre." },
                  { letter: "D", text: "Nada, para manter resultados iguais." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "Quais dados ajudam a IA a criar copy mais precisa?",
                options: [
                  { letter: "A", text: "Canal, publico, oferta, objecoes, tom de voz e metrica de sucesso." },
                  { letter: "B", text: "Somente a frase 'faca um anuncio legal'." },
                  { letter: "C", text: "A senha das contas de anuncio." },
                  { letter: "D", text: "Nenhuma informacao sobre produto." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      }
    ]
  },
  "ai-project-management": {
    id: "ai-project-management",
    title: "IA para Projetos",
    modules: [
      {
        id: "pm-mod-1",
        title: "Modulo 1: Gestao de Projetos com IA",
        lessons: [
          {
            id: "pm-mod-1-l1",
            title: "Escopo, Backlog e Priorizacao",
            icon: "Kanban",
            duration: "13 min",
            content: [
              {
                type: "heading",
                text: "Da ideia solta ao backlog executavel"
              },
              {
                type: "text",
                text: "A IA pode transformar uma conversa confusa em epicos, historias, criterios de aceite e riscos. Para isso, informe objetivo do produto, usuarios, restricoes, prazo e o que esta fora do escopo."
              },
              {
                type: "quote",
                text: "\"Backlog bom nao e lista gigante: e uma sequencia de decisoes priorizadas.\""
              },
              {
                type: "text",
                text: "Peça para a IA classificar itens por impacto, esforco, dependencia e risco. Depois valide com time tecnico e stakeholders."
              }
            ],
            questions: [
              {
                id: 1,
                question: "Como a IA ajuda na criacao de backlog?",
                options: [
                  { letter: "A", text: "Convertendo objetivos em epicos, historias, criterios de aceite e riscos." },
                  { letter: "B", text: "Eliminando toda conversa com stakeholders." },
                  { letter: "C", text: "Criando tarefas infinitas sem prioridade." },
                  { letter: "D", text: "Substituindo validacao tecnica." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "Quais criterios ajudam a priorizar backlog com IA?",
                options: [
                  { letter: "A", text: "Impacto, esforco, dependencia e risco." },
                  { letter: "B", text: "Ordem alfabetica." },
                  { letter: "C", text: "Tamanho do titulo da tarefa." },
                  { letter: "D", text: "Preferencia aleatoria do modelo." }
                ],
                correct: "A"
              }
            ]
          },
          {
            id: "pm-mod-1-l2",
            title: "Reunioes, Riscos e Status Report",
            icon: "CalendarCheck",
            duration: "15 min",
            content: [
              {
                type: "heading",
                text: "Menos reuniao perdida, mais decisao registrada"
              },
              {
                type: "text",
                text: "A IA pode resumir reunioes, extrair decisoes, donos, prazos, bloqueios e riscos. Tambem pode transformar notas soltas em status report executivo com semaforo, progresso, proximas acoes e pedidos de decisao."
              },
              {
                type: "quote",
                text: "\"Toda reuniao deve sair com decisoes, responsaveis e data. A IA ajuda a nao perder isso no ruido.\""
              },
              {
                type: "text",
                text: "Um bom prompt de status pede fatos verificados, mudancas desde a ultima atualizacao, riscos com impacto e acoes que precisam de patrocinio."
              }
            ],
            questions: [
              {
                id: 1,
                question: "O que a IA deve extrair de uma reuniao de projeto?",
                options: [
                  { letter: "A", text: "Decisoes, responsaveis, prazos, bloqueios e riscos." },
                  { letter: "B", text: "Somente piadas ditas na chamada." },
                  { letter: "C", text: "Dados que nao foram mencionados." },
                  { letter: "D", text: "Senhas e informacoes sensiveis sem necessidade." }
                ],
                correct: "A"
              },
              {
                id: 2,
                question: "O que torna um status report executivo util?",
                options: [
                  { letter: "A", text: "Progresso, riscos, proximas acoes e decisoes necessarias." },
                  { letter: "B", text: "Texto longo sem conclusao." },
                  { letter: "C", text: "Apenas elogios ao projeto." },
                  { letter: "D", text: "Detalhes irrelevantes sem prioridade." }
                ],
                correct: "A"
              }
            ]
          }
        ]
      }
    ]
  }
};
