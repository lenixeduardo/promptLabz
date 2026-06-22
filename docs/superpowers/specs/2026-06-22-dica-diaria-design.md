# Dica diária na tela inicial

## Objetivo

Ajudar estudantes a melhorar uso de IA com orientação curta e renovada diariamente, sem depender de internet ou backend.

## Experiência

- Exibir card “Dica do dia” na tela inicial, imediatamente acima do card de nível.
- Mostrar gatinha professora ao lado do texto, usando `/assets/mascot-teacher.png`.
- Manter layout compacto, responsivo e coerente com cores, bordas e tipografia atuais.
- Usar texto alternativo descritivo na imagem.

## Regra diária

- Manter 30 dicas locais sobre prompts, estudo, avaliação de respostas e uso responsável de IA.
- Escolher dica por índice determinístico calculado a partir da data civil local.
- Mesma data local sempre retorna mesma dica.
- Data local diferente avança seleção; após última dica, ciclo recomeça.
- Não usar `localStorage`, API ou Supabase.

## Arquitetura

- `src/data/dailyTipsData.ts`: conteúdo tipado das dicas.
- `src/lib/dailyTip.ts`: função pura que recebe `Date` e retorna dica correspondente.
- `src/components/DailyTipCard.tsx`: apresentação da gatinha e dica.
- `src/pages/Home.tsx`: integra card antes do bloco de nível.

Separação permite testar regra temporal sem renderização e componente sem acoplar lógica à Home.

## Casos de borda

- Lista vazia: função deve falhar explicitamente durante desenvolvimento.
- Virada do dia: nova montagem da Home usa data atual.
- Fuso horário: cálculo usa ano, mês e dia locais do navegador, evitando troca antecipada por UTC.
- Ciclo longo: módulo garante índice válido mesmo após várias rotações.

## Testes

- Teste unitário prova estabilidade no mesmo dia, mudança no dia seguinte e ciclo completo.
- Teste de componente prova título, texto e gatinha acessível.
- Teste da Home prova card renderizado antes do texto “Nível”.
- Rodar testes focados, suíte completa, typecheck, lint e build.

## Fora de escopo

- Painel administrativo para editar dicas.
- Personalização por usuário ou nível.
- Busca remota, notificações e persistência.
