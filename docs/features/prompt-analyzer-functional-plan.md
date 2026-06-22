# Plano funcional — Analisador de Prompts

## 1. Definição do produto

### Problema

Pessoas que conversam com ferramentas de IA acumulam prompts sem entender quais padrões geram respostas melhores, quais falhas se repetem e como reescrever pedidos fracos.

### Público

Estudantes, profissionais, freelancers e criadores iniciantes ou intermediários que usam ChatGPT, Claude, Gemini ou outras IAs e querem evoluir a qualidade dos próprios prompts.

### Proposta de valor

**Ajuda quem usa IA a identificar padrões, corrigir falhas e reescrever seus prompts sem enviar conversas privadas para servidores externos.**

### Objetivo do módulo

Transformar um arquivo de histórico de conversa em uma análise local, didática e acionável de até 50 mensagens do usuário, mantendo a linguagem gamificada e a identidade visual do PromptLabz.

## 2. Escopo do MVP

### Incluído

1. Atalho “Analisador de Prompts” na Home, imediatamente após o card de nível.
2. Tela protegida do analisador com saldo real de gemas, badge fixo “Novo” e nova gatinha investigadora com lupa.
3. Seleção real de arquivos `.txt` e `.md`, com limite máximo de 2 MB por arquivo.
4. Opções `.pdf` e `.docx` visíveis, marcadas como “Em breve” e sem possibilidade de seleção ou processamento.
5. Leitura e processamento integralmente locais no navegador.
6. Parser para exportações textuais de ChatGPT, Claude e Gemini, além de texto genérico.
7. Extração exclusiva das mensagens do usuário.
8. Limite de 50 prompts por análise.
9. Fallback que trata o texto inteiro como um único prompt quando nenhuma mensagem é reconhecida.
10. Motor local derivado do Laboratório atual, expandido para gerar nota, classificação, pontos fortes, falhas e sugestão reescrita.
11. Progresso de análise após confirmação do arquivo.
12. Resultado completo no mesmo espaço principal antes ocupado pelo upload.
13. Feedback individual por prompt, nota final, resumo consolidado e CTAs.
14. Histórico em memória da sessão, isolado por usuário autenticado.
15. Modal de análises anteriores.
16. Ação “Nova análise” que retorna ao estado inicial sem apagar o histórico da sessão.
17. Layout mobile fiel à referência e adaptação responsiva para desktop.
18. Estados de loading, vazio, erro, sucesso, foco e feedback acessível.

### Fora de escopo

- Upload ou persistência de arquivos em Supabase, API, banco, `localStorage`, `sessionStorage` ou IndexedDB.
- Envio do conteúdo para OpenAI, Anthropic, Google ou qualquer serviço externo.
- Processamento ativo de `.pdf`, `.docx`, imagens, áudio, ZIP ou JSON.
- OCR.
- Sincronização de histórico entre dispositivos, abas ou sessões.
- Exportação, download ou compartilhamento do relatório.
- Edição manual dos prompts dentro do resultado.
- Cobrança em gemas, XP, vidas ou assinatura.
- IA generativa real no MVP.
- Comparação automática entre análises diferentes.
- Análise das respostas do assistente, system prompts, tool calls ou anexos.
- Mais de um arquivo por análise.

## 3. Entrada pela Home

### Posição

O atalho entra **imediatamente após o card de nível** e antes dos cards “Sequência diária” e “Gemas”. A posição não pode variar por viewport, progresso, saldo ou estado do usuário.

### Estrutura do card

- Ícone/ilustração: gatinha investigadora com lupa.
- Título: **“Analisador de Prompts”**
- Badge fixo: **“Novo”**
- Descrição: **“Envie seu histórico e descubra como melhorar seus prompts.”**
- CTA visual: seta para a direita.
- Destino: tela do Analisador de Prompts.

### Comportamento

- O card inteiro é clicável.
- Hover no desktop: borda verde mais forte, leve elevação e seta deslocada para a direita.
- Foco por teclado: contorno visível de 2 px com contraste mínimo de 3:1.
- Pressionado: redução visual sutil de escala, sem atraso de navegação.
- O badge “Novo” permanece visível em todas as visitas durante o MVP.

## 4. Jornada completa

### 4.1 Abertura

1. Usuário autenticado acessa a Home.
2. Encontra o atalho imediatamente após o card de nível.
3. Aciona o card.
4. Tela do analisador abre no estado inicial.
5. Topo exibe voltar, título, badge “Novo”, descrição e saldo real de gemas.

### 4.2 Seleção do arquivo

1. Usuário aciona “Escolher arquivo”.
2. Seletor nativo aceita somente `.txt` e `.md`.
3. Antes da leitura, sistema valida extensão, MIME quando disponível e tamanho.
4. Arquivo válido é lido localmente.
5. Área de upload muda para estado “arquivo selecionado”.
6. Usuário pode remover o arquivo ou iniciar a análise.

### 4.3 Validação e parsing

1. Sistema normaliza quebras de linha e remove somente espaços externos do arquivo.
2. Detecta estrutura provável: ChatGPT, Claude, Gemini ou texto genérico.
3. Extrai somente mensagens atribuídas ao usuário.
4. Remove mensagens vazias.
5. Preserva ordem original.
6. Se houver mais de 50 mensagens válidas, mantém as 50 primeiras e informa o corte.
7. Se nenhuma mensagem for reconhecida, usa o texto inteiro como um único prompt e registra aviso de fallback.
8. Se o arquivo estiver vazio ou contiver apenas espaços, interrompe o fluxo com erro.

### 4.4 Análise

1. Usuário aciona “Analisar prompts”.
2. Conteúdo do card principal é substituído pelo progresso.
3. Controles de troca, remoção e envio ficam indisponíveis.
4. Motor local avalia cada prompt.
5. Ao concluir, progresso é substituído pelo resultado completo.
6. Análise concluída entra no histórico em memória do usuário atual.

### 4.5 Resultado

1. Usuário vê nota final e resumo.
2. Vê cada prompt na ordem original, com classificação, pontos fortes, falhas e versão reescrita.
3. Pode abrir “Ver análises anteriores”.
4. Pode acionar “Nova análise”.

### 4.6 Histórico

1. “Ver análises anteriores” abre modal.
2. Modal lista análises concluídas pelo usuário atual durante a sessão viva da aplicação.
3. Selecionar item fecha o modal e restaura o resultado correspondente.
4. Troca de usuário apresenta somente o histórico do novo `userId`.
5. Logout ou recarga completa apaga todo o histórico em memória.

### 4.7 Nova análise

1. Usuário aciona “Nova análise”.
2. Resultado atual deixa de ocupar a área principal.
3. Tela retorna ao upload inicial.
4. Arquivo anterior, progresso, avisos e erros são limpos.
5. Histórico da sessão permanece disponível.

## 5. Regras de arquivo e parser

### Arquivos ativos

| Formato | Estado | Regra |
|---|---|---|
| `.txt` | Disponível | Pode ser selecionado e processado. |
| `.md` | Disponível | Pode ser selecionado e processado. |
| `.pdf` | Em breve | Visível na interface, bloqueado e não incluído no seletor. |
| `.docx` | Em breve | Visível na interface, bloqueado e não incluído no seletor. |

### Validações

- Exatamente um arquivo por análise.
- Tamanho máximo inclusivo: `2.097.152` bytes.
- Arquivo com `2.097.152` bytes é aceito.
- Arquivo com `2.097.153` bytes é rejeitado.
- Extensão é comparada sem diferenciar maiúsculas e minúsculas.
- Extensão válida com MIME ausente pode ser aceita.
- MIME incompatível com extensão válida gera erro de tipo.
- Nome do arquivo serve apenas para exibição; nunca compõe HTML sem escape.
- Conteúdo vazio após `trim()` não pode ser analisado.
- Falha de leitura interrompe o fluxo sem criar item no histórico.

### Estratégia de detecção

Ordem determinística:

1. ChatGPT.
2. Claude.
3. Gemini.
4. Texto genérico estruturado.
5. Fallback de texto inteiro.

### Marcadores reconhecidos

O parser deve aceitar variações comuns, com comparação sem diferenciar maiúsculas, minúsculas ou espaços externos:

- ChatGPT: `User:`, `You:`, `Usuário:`, `Você:` e blocos de exportação equivalentes.
- Claude: `Human:`, `User:`, `Usuário:` e cabeçalhos equivalentes.
- Gemini: `You:`, `User:`, `Você:`, `Usuário:` e cabeçalhos equivalentes.
- Assistente, ignorados na análise: `Assistant:`, `ChatGPT:`, `Claude:`, `Gemini:`, `Model:`, `IA:` e `Assistente:`.

Uma mensagem começa no marcador reconhecido e termina no próximo marcador de papel. Quebras internas, listas e blocos Markdown pertencem à mensagem atual.

### Texto genérico

- Se houver pares claros de papel, aplicar as mesmas regras de extração.
- Se houver somente blocos separados sem atribuição confiável, não inferir arbitrariamente quais blocos são do usuário.
- Nessa situação, aplicar fallback ao conteúdo inteiro.

### Limite de prompts

- Analisar no máximo 50 prompts por arquivo.
- Considerar as 50 primeiras mensagens válidas do usuário.
- Não dividir um prompt longo em vários.
- Não combinar mensagens reconhecidas.
- Exibir aviso quando mensagens excedentes forem ignoradas.

## 6. Motor local de análise

### Princípio

O MVP usa regras locais e determinísticas, aproveitando os critérios existentes do Laboratório: extensão adequada, persona, ação clara, contexto, formato, restrições, público, exemplos, tom, diretrizes negativas, raciocínio guiado e delimitadores. O módulo acrescenta diagnóstico estruturado e reescrita baseada em templates locais.

### Saída obrigatória por prompt

- Texto original.
- Posição na conversa.
- Horário, somente quando presente e reconhecido no arquivo.
- Nota de `0,0` a `10,0`, com uma casa decimal.
- Classificação.
- Até três pontos fortes.
- Até três falhas prioritárias.
- Explicação curta e específica.
- Sugestão reescrita completa.

### Classificação

| Nota | Classificação | Cor |
|---|---|---|
| `0,0–4,9` | “Prompt muito vago” | Vermelho |
| `5,0–7,9` | “Bom prompt, mas pode melhorar” | Âmbar |
| `8,0–10,0` | “Excelente prompt!” | Verde |

### Nota final

- Média aritmética simples das notas dos prompts analisados.
- Arredondamento para uma casa decimal somente após calcular a média completa.
- Escala exibida: `/10`.
- Nenhuma categoria recebe peso extra na média da conversa.

### Resumo consolidado

Deve informar:

- Quantidade total analisada.
- Quantidade classificada como excelente.
- Quantidade com pontos de melhoria.
- Quantidade que necessita ajustes.
- Até três forças recorrentes.
- Até três falhas recorrentes.
- Mensagem final coerente com a média.

### Faixas da mensagem final

| Média | Título | Mensagem |
|---|---|---|
| `0,0–4,9` | “Vamos fortalecer seus prompts” | “Seus pedidos ainda precisam de mais contexto, objetivo e formato. Use as sugestões abaixo como ponto de partida.” |
| `5,0–7,9` | “Bom caminho!” | “Seus prompts têm uma base útil. Detalhes mais específicos podem tornar as respostas muito melhores.” |
| `8,0–10,0` | “Muito bom! 🎉” | “Seus prompts estão acima da média. Continue refinando contexto e critérios para chegar ainda mais longe.” |

### Reescrita local

A sugestão deve:

1. Manter a intenção original.
2. Não inventar dados pessoais, métricas, marcas ou fatos.
3. Acrescentar, quando ausentes, campos claros para contexto, objetivo, público, formato, tom e restrições.
4. Usar colchetes para informações que dependem do usuário, por exemplo `[público-alvo]`.
5. Ser exibida para todas as classificações, inclusive prompts excelentes.
6. Nunca ser apresentada como conteúdo gerado por IA real.

### Arquitetura híbrida futura

O contrato de resultado deve ser independente do provedor de análise. O motor local e uma futura IA remota devem produzir o mesmo formato funcional: nota, classificação, forças, falhas, explicação e reescrita. O MVP não chama rede. Ativar IA real futuramente exigirá consentimento explícito, revisão da mensagem de privacidade e nova decisão de produto.

## 7. Estrutura visual

Referência obrigatória: `C:\Users\uzinh\.codex\attachments\b0cc0736-9ef5-40f2-8ab0-98d1eeb84044\image-1.png`.

### Ordem no estado inicial

1. Header.
2. Card de upload.
3. Mensagem de privacidade.
4. Card de dica.
5. Seção “Como funciona”.
6. Seção “Exemplo de análise”.
7. Navegação inferior existente.

### Header

- Botão circular de voltar à esquerda.
- Bloco central com título, badge e descrição.
- Saldo real de gemas em cápsula à direita.
- Título em uma linha quando houver largura; descrição centralizada em até duas linhas.
- Badge “Novo” verde-claro, sempre visível.
- Gemas são informativas; análise mostra “Grátis” no fluxo e não desconta saldo.

### Card de upload

- Borda verde, cantos amplos e fundo claro.
- Gatinha investigadora à esquerda.
- Título e formatos no centro.
- CTA verde à direita no desktop e abaixo do texto no mobile estreito.
- `.txt` e `.md` com aparência ativa.
- `.pdf` e `.docx` em chips atenuados, com rótulo “Em breve” e ícone de cadeado.

### Privacidade

- Bloco curto logo abaixo do upload.
- Ícone de escudo ou cadeado.
- Fundo verde muito claro.
- Texto sempre visível; não depender de tooltip.

### Dica

- Faixa de fundo suave.
- Ícone de lâmpada verde.
- Palavra “Dica:” em negrito.
- Texto alinhado à esquerda.

### Como funciona

Quatro etapas numeradas:

1. Envie seu arquivo.
2. Analisamos seus prompts.
3. Você recebe o feedback.
4. Confira sua nota final.

No mobile, cards em carrossel horizontal acessível ou grade de uma coluna. No desktop, quatro cards na mesma linha, conectados visualmente por setas.

### Exemplo de análise

- Mantém três exemplos estáticos: vermelho, âmbar e verde.
- Cada linha mostra prompt à esquerda e diagnóstico à direita no desktop.
- No mobile, prompt fica acima do diagnóstico.
- Exemplos não entram na nota nem no histórico.

### Estado de resultado

Após a escolha e a análise, todo o conteúdo do card de upload é substituído pelo relatório. Dica, “Como funciona” e exemplo deixam de ser o foco principal; o resultado assume a ordem:

1. Avisos de limite ou fallback, quando existirem.
2. Lista de feedback por prompt.
3. Card “Nota final da conversa”.
4. Card “Resumo da análise”.
5. CTAs “Ver análises anteriores” e “Nova análise”.

### Desktop

- Conteúdo central com largura máxima que preserve leitura confortável.
- Feedback por prompt em duas colunas: original e diagnóstico.
- Nota final e resumo lado a lado.
- CTAs lado a lado.

### Mobile

- Prioridade para largura útil e leitura sem zoom.
- Nenhum texto menor que 12 px.
- Botões com alvo mínimo de 44 × 44 px.
- Cards empilhados quando duas colunas comprimirem conteúdo.
- Sem rolagem horizontal, exceto carrossel deliberado das etapas com indicação de continuidade.
- CTA principal permanece visível ao fim do conteúdo, sem cobrir a navegação inferior.

## 8. Estados e copy final

## 8.1 Estado inicial

### Header

- Título: **“Analisador de Prompts”**
- Badge: **“Novo”**
- Descrição: **“Envie seu histórico de conversa com IA e receba uma análise completa.”**
- Label acessível do saldo: **“Saldo de gemas: {saldo}”**
- Label do voltar: **“Voltar para a Home”**

### Upload

- Título: **“Anexe seu histórico de conversa”**
- Formatos ativos: **“.txt e .md”**
- Formatos bloqueados: **“.pdf e .docx — Em breve”**
- Limite: **“Tamanho máximo: 2 MB”**
- Gratuidade: **“Análise gratuita”**
- Botão: **“Escolher arquivo”**
- Label acessível do input: **“Selecionar histórico de conversa em formato TXT ou Markdown”**

### Privacidade

- Título: **“Seu arquivo fica no seu dispositivo”**
- Texto: **“O conteúdo é processado localmente no navegador. Ele nunca é enviado, salvo ou compartilhado.”**

### Dica

**“Dica: Exporte suas conversas do ChatGPT, Gemini, Claude ou outras IAs em formato .txt ou .md para facilitar a análise.”**

### Como funciona

- Título da seção: **“Como funciona”**
- Etapa 1 — título: **“Envie seu arquivo”**
- Etapa 1 — texto: **“Anexe o histórico da sua conversa com a IA.”**
- Etapa 2 — título: **“Analisamos seus prompts”**
- Etapa 2 — texto: **“Avaliamos somente as mensagens que você enviou.”**
- Etapa 3 — título: **“Você recebe o feedback”**
- Etapa 3 — texto: **“Identificamos pontos fortes, falhas e melhorias.”**
- Etapa 4 — título: **“Confira sua nota final”**
- Etapa 4 — texto: **“Veja sua média e os padrões da conversa.”**

### Exemplo

- Título da seção: **“Exemplo de análise”**
- Exemplo vermelho — prompt: **“Crie um texto sobre marketing.”**
- Exemplo vermelho — título: **“Prompt muito vago”**
- Exemplo vermelho — texto: **“Faltam contexto, objetivo, público, tom e formato de entrega.”**
- Exemplo vermelho — label: **“Solução sugerida”**
- Exemplo vermelho — sugestão: **“Crie um texto persuasivo sobre marketing digital para pequenas empresas, com tom profissional e formato de artigo para blog.”**
- Exemplo âmbar — prompt: **“Explique como funciona o marketing de conteúdo para iniciantes.”**
- Exemplo âmbar — título: **“Bom prompt, mas pode melhorar”**
- Exemplo âmbar — texto: **“Inclua o formato desejado e o nível de profundidade.”**
- Exemplo âmbar — label: **“Sugestão”**
- Exemplo âmbar — sugestão: **“Explique como funciona o marketing de conteúdo para iniciantes, com exemplos práticos e passos acionáveis.”**
- Exemplo verde — prompt: **“Quais são as melhores estratégias de SEO para um site novo e como aplicá-las?”**
- Exemplo verde — título: **“Excelente prompt!”**
- Exemplo verde — texto: **“Pedido claro, específico e com contexto suficiente para gerar uma resposta útil.”**

## 8.2 Hover e foco

- Tooltip de `.pdf`: **“PDF estará disponível em breve.”**
- Tooltip de `.docx`: **“DOCX estará disponível em breve.”**
- Label do botão bloqueado: **“Formato indisponível: {formato}”**
- Foco do botão de upload mantém o texto **“Escolher arquivo”**.
- Hover não altera copy.

## 8.3 Arquivo selecionado

- Título: **“Arquivo pronto para análise”**
- Nome: **“{nome-do-arquivo}”**
- Metadado: **“{tamanho-formatado} • Processamento local”**
- Texto: **“Vamos analisar até 50 mensagens enviadas por você.”**
- Botão primário: **“Analisar prompts”**
- Botão secundário: **“Trocar arquivo”**
- Botão de remoção: **“Remover arquivo”**
- Label acessível de remoção: **“Remover {nome-do-arquivo}”**

## 8.4 Analisando

- Título: **“Analisando seus prompts…”**
- Texto: **“A gatinha investigadora está procurando padrões, pontos fortes e oportunidades de melhoria.”**
- Progresso 1: **“Lendo o arquivo”**
- Progresso 2: **“Identificando suas mensagens”**
- Progresso 3: **“Avaliando até 50 prompts”**
- Progresso 4: **“Preparando seu relatório”**
- Label acessível: **“Análise em andamento”**
- Botões: desabilitados, sem CTA de cancelamento no MVP.

## 8.5 Erro de tipo

- Título: **“Formato não aceito”**
- Texto: **“Escolha um arquivo .txt ou .md. PDF e DOCX estarão disponíveis em breve.”**
- Botão: **“Escolher outro arquivo”**

## 8.6 Erro de tamanho

- Título: **“Arquivo muito grande”**
- Texto: **“O tamanho máximo é 2 MB. Escolha um arquivo menor e tente novamente.”**
- Botão: **“Escolher outro arquivo”**

## 8.7 Arquivo vazio

- Título: **“Não encontramos conteúdo”**
- Texto: **“O arquivo está vazio ou contém apenas espaços. Escolha outro histórico para analisar.”**
- Botão: **“Escolher outro arquivo”**

## 8.8 Falha de leitura

- Título: **“Não foi possível ler o arquivo”**
- Texto: **“O arquivo pode estar corrompido ou com uma codificação incompatível. Salve-o novamente como UTF-8 e tente outra vez.”**
- Botão: **“Tentar com outro arquivo”**

## 8.9 Fallback

- Título do aviso: **“Formato de conversa não reconhecido”**
- Texto: **“Não identificamos mensagens separadas no arquivo. Por isso, analisamos todo o texto como um único prompt.”**
- O aviso permanece visível no resultado.

## 8.10 Limite excedido

- Título do aviso: **“Limite de 50 prompts aplicado”**
- Texto: **“Encontramos {total} mensagens suas. Para manter a análise rápida, avaliamos as 50 primeiras.”**

## 8.11 Sucesso

### Cabeçalho do resultado

- Título: **“Sua análise está pronta!”**
- Texto singular: **“Analisamos 1 prompt do seu histórico.”**
- Texto plural: **“Analisamos {quantidade} prompts do seu histórico.”**
- Badge: **“Processado localmente”**

### Feedback por prompt

- Identificação: **“Prompt {posição}”**
- Autor: **“Você”**
- Label da nota: **“Nota do prompt”**
- Label de forças: **“Pontos fortes”**
- Estado sem força detectada: **“Ainda não identificamos um ponto forte consistente.”**
- Label de falhas: **“O que pode melhorar”**
- Estado sem falha crítica: **“Nenhuma falha crítica detectada.”**
- Label da explicação: **“Por que recebeu esta nota”**
- Label da reescrita: **“Sugestão reescrita”**
- Botão de cópia: **“Copiar sugestão”**
- Confirmação de cópia: **“Sugestão copiada!”**
- Erro de cópia: **“Não foi possível copiar. Selecione o texto manualmente.”**

### Nota final

- Título: **“Nota final da conversa”**
- Escala: **“{nota}/10”**
- Complemento: usar título e mensagem da faixa definida na seção 6.

### Resumo

- Título: **“Resumo da análise”**
- Total singular: **“1 prompt analisado”**
- Total plural: **“{quantidade} prompts analisados”**
- Excelente singular: **“1 excelente”**
- Excelente plural: **“{quantidade} excelentes”**
- Melhoria singular: **“1 com pontos de melhoria”**
- Melhoria plural: **“{quantidade} com pontos de melhoria”**
- Ajuste singular: **“1 necessita ajustes”**
- Ajuste plural: **“{quantidade} necessitam ajustes”**
- Forças recorrentes: **“Seus pontos fortes mais frequentes”**
- Falhas recorrentes: **“O que mais pode elevar suas notas”**

### CTAs

- Secundário: **“Ver análises anteriores”**
- Primário: **“Nova análise”**

## 8.12 Histórico vazio

- Título do modal: **“Análises anteriores”**
- Título do estado vazio: **“Nenhuma análise anterior”**
- Texto: **“As análises concluídas nesta sessão aparecerão aqui.”**
- Botão: **“Fechar”**

## 8.13 Histórico populado

- Título do modal: **“Análises anteriores”**
- Subtítulo: **“Disponíveis somente nesta sessão.”**
- Item: **“{nome-do-arquivo}”**
- Metadado: **“{quantidade} prompts • Nota {nota}/10 • {hora}”**
- Ação: **“Abrir análise”**
- Label acessível: **“Abrir análise de {nome-do-arquivo}”**
- Botão: **“Fechar”**

## 9. Histórico e privacidade

### Estrutura funcional

- Histórico é um mapa em memória indexado pelo `userId` autenticado.
- Cada item guarda somente enquanto a aplicação está carregada: identificador temporário, nome do arquivo, horário local da conclusão, quantidade, nota e resultado completo.
- Conteúdo bruto do arquivo não é retido separadamente após gerar o resultado; prompts originais necessários ao relatório ficam somente no objeto em memória.
- Nenhuma chave é gravada em armazenamento persistente.

### Limpeza

- Recarga completa: apaga todo o mapa.
- Fechamento da aba: apaga todo o mapa.
- Logout: limpa todo o mapa antes de concluir a saída.
- Troca de usuário sem recarga: histórico anterior permanece inacessível e deve ser removido no logout.
- “Nova análise”: não apaga histórico.
- Erro, arquivo vazio ou análise interrompida: não cria histórico.

### Garantias de privacidade

- `FileReader` ou API local equivalente é a única origem do conteúdo.
- Nenhum trecho do arquivo pode entrar em analytics, logs, Sentry, mensagens de erro remotas ou parâmetros de URL.
- Nome do arquivo também não deve ser enviado para analytics.
- Console não deve registrar conteúdo, prompts, resultado ou metadados do arquivo.
- Saldo de gemas pode continuar usando fonte real existente; ele não se mistura ao processamento do arquivo.

## 10. Regras de negócio

1. Usuário precisa estar autenticado para acessar o módulo.
2. Análise custa zero gemas e zero XP.
3. Saldo mostrado deve ser o mesmo saldo real já usado na Home.
4. Badge “Novo” é fixo e não depende de visita.
5. Somente `.txt` e `.md` são processáveis.
6. `.pdf` e `.docx` permanecem visíveis e bloqueados.
7. Limite por arquivo: 2 MB.
8. Limite por análise: 50 prompts do usuário.
9. Somente mensagens do usuário entram na análise e na média.
10. Respostas da IA podem ser usadas apenas como delimitadores de parsing, nunca como conteúdo avaliado.
11. Nenhuma mensagem reconhecida ativa fallback de prompt único.
12. Arquivo vazio nunca ativa fallback.
13. Nota individual varia de 0,0 a 10,0.
14. Nota final é média simples, com uma casa decimal.
15. Resultado só entra no histórico após conclusão integral.
16. Histórico é separado por usuário e existe somente em memória.
17. Recarga e logout apagam histórico.
18. “Nova análise” preserva histórico e volta ao upload.
19. Abrir item do histórico não cria cópia nem altera horário.
20. Exemplos estáticos não usam arquivo, não afetam saldo e não entram no histórico.

## 11. Acessibilidade e comportamento

- Ordem de tabulação acompanha ordem visual.
- Todos os botões têm nome acessível.
- Área de upload não depende exclusivamente de arrastar e soltar.
- Erros usam `role="alert"` ou mecanismo equivalente.
- Progresso usa anúncio não intrusivo e valor quando mensurável.
- Modal prende foco, fecha com `Esc` e devolve foco ao botão que o abriu.
- Cores de classificação sempre são acompanhadas por ícone e texto.
- Contraste mínimo: 4,5:1 para texto normal e 3:1 para texto grande e elementos de interface.
- Movimento respeita `prefers-reduced-motion`.
- Toast de cópia não recebe foco automaticamente.
- Nomes longos de arquivo são truncados visualmente, mas ficam completos no nome acessível.

## 12. Critérios de aceitação

### Home

1. Card aparece imediatamente após o card de nível no DOM e visualmente.
2. Card contém título, descrição, gatinha investigadora, seta e badge “Novo”.
3. Clique e teclado abrem o analisador.
4. Badge continua visível após revisitar a tela.

### Upload

5. Seletor permite `.txt` e `.md`.
6. `.pdf` e `.docx` aparecem como “Em breve” e não podem ser processados.
7. Arquivo de até 2 MB é aceito.
8. Arquivo acima de 2 MB mostra erro exato de tamanho.
9. Formato inválido mostra erro exato de tipo.
10. Arquivo vazio mostra erro específico e não inicia progresso.
11. Arquivo selecionado mostra nome, tamanho e ações de analisar, trocar e remover.
12. Mensagem de privacidade fica visível antes da seleção.

### Parser

13. Fixtures representativas de ChatGPT, Claude e Gemini extraem somente mensagens do usuário.
14. Ordem das mensagens é preservada.
15. Quebras e Markdown internos permanecem no prompt correto.
16. Mais de 50 mensagens resulta em exatamente 50 análises e aviso de limite.
17. Nenhuma mensagem reconhecida gera exatamente uma análise e aviso de fallback.
18. Respostas do assistente não aparecem como prompts avaliados.

### Análise

19. Cada prompt produz nota, classificação, pontos fortes, falhas, explicação e reescrita.
20. Faixas de classificação seguem exatamente `0,0–4,9`, `5,0–7,9` e `8,0–10,0`.
21. Média final corresponde à média simples, arredondada para uma casa decimal.
22. Mesmo arquivo no mesmo código gera o mesmo resultado.
23. Nenhuma requisição de rede contém conteúdo ou nome do arquivo.
24. Gemas antes e depois da análise permanecem iguais.

### Progresso e resultado

25. Acionar análise substitui upload por progresso.
26. Progresso mostra as quatro etapas na ordem definida.
27. Conclusão substitui progresso pelo relatório sem recarregar a página.
28. Resultado segue a ordem visual definida.
29. Singular e plural são exibidos corretamente.
30. Copiar sugestão apresenta confirmação ou erro.

### Histórico

31. Primeira abertura antes de análises mostra estado vazio.
32. Cada conclusão adiciona um item ao usuário atual.
33. Selecionar item restaura resultado correto.
34. Usuário B não vê itens do usuário A.
35. “Nova análise” mantém itens existentes.
36. Recarga completa remove todos os itens.
37. Logout remove todos os itens.

### Responsividade e acessibilidade

38. Layout funciona a partir de 320 px sem conteúdo cortado.
39. Desktop mantém leitura confortável e usa duas colunas onde especificado.
40. Navegação completa funciona por teclado.
41. Modal gerencia foco e `Esc`.
42. Erros e progresso são anunciados por tecnologia assistiva.
43. Classificação nunca depende somente de cor.

### Privacidade

44. Conteúdo não aparece em `localStorage`, `sessionStorage`, IndexedDB, Supabase ou URL.
45. Conteúdo não aparece em logs de console ou telemetria.
46. Copy de processamento local fica visível no upload e no resultado.

## 13. Matriz de pontuação QA

Aprovação exige **mínimo de 95/100**, nenhum vazamento de conteúdo e nenhuma falha bloqueadora. Vazamento, envio externo do arquivo, mistura de histórico entre usuários ou análise de mensagens do assistente reprova automaticamente, independentemente da pontuação.

| Área | Pontos | Condição para pontuação integral |
|---|---:|---|
| Entrada pela Home | 8 | Posição exata, card completo, navegação, foco e badge fixo. |
| Fidelidade visual mobile | 12 | Ordem, hierarquia, composição, cores, cards e CTAs coerentes com a referência. |
| Adaptação desktop | 6 | Layout amplo sem esticar leitura, colunas e responsividade corretas. |
| Upload e validações | 12 | `.txt`/`.md`, 2 MB, vazio, leitura, troca e remoção funcionam. |
| Formatos “Em breve” | 4 | `.pdf`/`.docx` visíveis, claros e bloqueados. |
| Parser e limite | 14 | Quatro origens, somente usuário, ordem, 50 prompts, fallback e avisos. |
| Motor e resultado | 14 | Nota, classificação, forças, falhas, explicação, reescrita, média e resumo corretos. |
| Estados e copy | 8 | Todos os estados previstos usam copy exata, singular/plural e feedback adequado. |
| Histórico por usuário | 8 | Memória de sessão, isolamento, modal, restauração e limpeza corretos. |
| Privacidade e gemas | 6 | Zero persistência/envio/log, mensagem explícita, saldo real e análise gratuita. |
| Acessibilidade | 5 | Teclado, foco, modal, alertas, contraste, labels e redução de movimento. |
| Testes e regressão | 3 | Casos críticos automatizados e fluxos existentes sem regressão. |
| **Total** | **100** |  |

### Severidade de defeitos

- **Bloqueador:** vazamento, upload externo, quebra de autenticação, mistura entre usuários, resultado impossível de acessar, crash.
- **Crítico:** parser inclui respostas da IA, limite ignorado, nota incorreta, histórico persiste após reload/logout, gemas descontadas.
- **Maior:** copy errada em erro, estado ausente, modal inacessível, layout quebrado em 320 px.
- **Menor:** desalinhamento pequeno, transição inconsistente, truncamento sem impacto funcional.

### Regra de aprovação

- `95–100`: aprovado, desde que sem bloqueador ou crítico.
- `90–94`: reprovado; corrigir itens e repetir QA completo.
- `<90`: reprovado; revisão funcional e visual obrigatória.
- Um único defeito bloqueador ou crítico: reprovado, mesmo com nota calculada acima de 95.

## 14. Riscos e mitigação

| Risco | Impacto | Mitigação decidida |
|---|---|---|
| Exportações variam entre versões e idiomas. | Parser pode não reconhecer papéis. | Marcadores multilíngues, fixtures por provedor e fallback explícito. |
| Texto genérico pode parecer uma conversa sem papéis claros. | Extração incorreta. | Não inferir blocos arbitrariamente; analisar tudo como um prompt. |
| Arquivo grande pode travar dispositivo móvel. | Lentidão ou interface congelada. | Limite rígido de 2 MB e máximo de 50 prompts. |
| Motor heurístico pode soar mais inteligente do que é. | Expectativa enganosa. | Copy fala em análise local; não chamar resultado de “análise por IA”. |
| Reescrita local pode inventar contexto. | Sugestão inadequada. | Preservar intenção e usar campos entre colchetes quando faltar informação. |
| Referência mostra 10 MB, `.pdf` e `.docx` aceitos. | Divergência visual/funcional. | Brief aprovado prevalece: 2 MB; PDF e DOCX visíveis como “Em breve”. |
| Histórico em memória pode surpreender após recarga. | Perda percebida. | Modal informa “Disponíveis somente nesta sessão”. |
| Troca de conta sem reload. | Exposição entre usuários. | Indexação por `userId` e limpeza explícita no logout. |
| Conteúdo pode vazar por observabilidade. | Violação de privacidade. | Proibir conteúdo e nome em logs, analytics, Sentry e URLs. |
| 50 primeiros prompts podem não representar toda conversa. | Resumo parcial. | Aviso de limite informa total encontrado e recorte aplicado. |

## 15. Decisões registradas

1. **Brief prevalece sobre a imagem em regras funcionais.** A imagem orienta composição, mas o produto aceita somente `.txt` e `.md` até 2 MB.
2. **Nota usa escala de 0 a 10.** Mantém fidelidade ao resultado `8,2/10` da referência e simplifica leitura.
3. **Média é simples.** Evita pesos opacos e facilita validação.
4. **Somente mensagens do usuário são analisadas.** O objetivo é melhorar a escrita do usuário, não avaliar respostas das IAs.
5. **Fallback é conservador.** Sem papéis confiáveis, texto inteiro vira um prompt; sistema não inventa autoria.
6. **Primeiras 50 mensagens são usadas.** Regra previsível, reproduzível e fácil de explicar.
7. **Motor permanece local no MVP.** Protege privacidade, não cria custo variável e reutiliza maturidade do Laboratório.
8. **Contrato prepara motor remoto futuro.** Troca de implementação não deve exigir redesenho do relatório.
9. **Histórico não persiste.** Privacidade e simplicidade têm prioridade sobre conveniência entre sessões.
10. **Análise é gratuita.** Saldo real reforça continuidade do produto, mas não funciona como preço.
11. **Badge “Novo” é permanente no MVP.** Sem estado de “já visto”, reduz complexidade e cumpre o brief.
12. **Resultado substitui upload.** Evita tela longa duplicando entrada e saída e segue a referência aprovada.
13. **Reescrita aparece em toda nota.** Mesmo prompts excelentes podem ganhar precisão.
14. **Sem cancelamento durante análise.** Processamento local e limitado deve ser curto; cancelamento adicionaria estados sem valor proporcional.
15. **QA exige 95/100.** Privacidade, isolamento e parsing incorreto são falhas de reprovação automática.

## 16. Self-review

- Escopo contém 18 entregas fechadas e lista explícita de fora de escopo.
- Jornada cobre Home, upload, validação, parsing, progresso, resultado, histórico e nova análise.
- Estados inicial, hover/foco, selecionado, analisando, erros, vazio, fallback, sucesso e histórico estão definidos.
- Copy final não contém `TBD`, `TODO`, texto provisório ou alternativa em aberto.
- Limites de 2 MB e 50 prompts são consistentes em todo o documento.
- `.pdf` e `.docx` permanecem visíveis, bloqueados e rotulados “Em breve”.
- Privacidade proíbe rede, persistência, logs e telemetria de conteúdo.
- Nota, faixas, média e resumo possuem regras mensuráveis.
- Matriz QA soma 100 pontos e aprova somente a partir de 95.
- Decisões resolvem divergências entre referência visual, brief e comportamento atual do Laboratório.

