# Dica Diária Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Exibir gatinha professora com dica local que muda diariamente acima do cartão de nível da Home.

**Architecture:** Conteúdo fica em módulo de dados tipado; seleção diária fica em função pura baseada na data civil local; componente visual recebe dica por propriedade. Home calcula dica atual uma vez na renderização e posiciona componente antes do nível.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vitest, Testing Library.

---

## Estrutura de arquivos

- Criar `src/data/dailyTipsData.ts`: tipo `DailyTip` e catálogo com 30 dicas.
- Criar `src/lib/dailyTip.ts`: cálculo determinístico da dica para data local.
- Criar `src/lib/dailyTip.test.ts`: testes unitários da rotação.
- Criar `src/components/DailyTipCard.tsx`: card acessível com mascote.
- Criar `src/components/DailyTipCard.test.tsx`: teste de apresentação.
- Criar `src/pages/Home.test.tsx`: teste leve da posição sem carregar dependências reais da Home.
- Modificar `src/pages/Home.tsx`: integrar dica acima do nível.

### Task 1: Regra determinística de rotação

**Files:**
- Create: `src/data/dailyTipsData.ts`
- Create: `src/lib/dailyTip.ts`
- Test: `src/lib/dailyTip.test.ts`

- [ ] **Step 1: Escrever testes falhando**

```ts
import { describe, expect, it } from "vitest";
import { getDailyTip, getLocalDayNumber } from "@/lib/dailyTip";

describe("getDailyTip", () => {
  const tips = [
    { id: "one", text: "Primeira" },
    { id: "two", text: "Segunda" },
    { id: "three", text: "Terceira" },
  ];

  it("mantém a mesma dica durante a mesma data local", () => {
    expect(getDailyTip(new Date(2026, 5, 22, 0, 1), tips)).toEqual(
      getDailyTip(new Date(2026, 5, 22, 23, 59), tips),
    );
  });

  it("avança para outra dica no dia seguinte", () => {
    expect(getDailyTip(new Date(2026, 5, 23), tips).id).not.toBe(
      getDailyTip(new Date(2026, 5, 22), tips).id,
    );
  });

  it("reinicia após completar o catálogo", () => {
    expect(getDailyTip(new Date(2026, 5, 25), tips)).toEqual(
      getDailyTip(new Date(2026, 5, 22), tips),
    );
  });

  it("rejeita catálogo vazio", () => {
    expect(() => getDailyTip(new Date(2026, 5, 22), [])).toThrow(
      "Daily tips catalog cannot be empty",
    );
  });
});

describe("getLocalDayNumber", () => {
  it("ignora horário e usa apenas data civil local", () => {
    expect(getLocalDayNumber(new Date(2026, 5, 22, 0, 1))).toBe(
      getLocalDayNumber(new Date(2026, 5, 22, 23, 59)),
    );
  });
});
```

- [ ] **Step 2: Executar teste e confirmar RED**

Run: `npm.cmd test -- src/lib/dailyTip.test.ts`

Expected: FAIL porque `@/lib/dailyTip` ainda não existe.

- [ ] **Step 3: Criar catálogo tipado**

```ts
export interface DailyTip {
  id: string;
  text: string;
}

export const DAILY_TIPS: DailyTip[] = [
  { id: "context", text: "Dê contexto antes do pedido: objetivo, público e cenário melhoram muito a resposta." },
  { id: "role", text: "Peça para a IA assumir um papel específico, como revisora, professora ou estrategista." },
  { id: "format", text: "Diga qual formato você espera: lista, tabela, resumo, roteiro ou passo a passo." },
  { id: "example", text: "Inclua um exemplo do resultado ideal para reduzir respostas genéricas." },
  { id: "constraints", text: "Defina limites claros de tamanho, tom, prazo ou ferramentas disponíveis." },
  { id: "audience", text: "Informe para quem a resposta será criada e qual conhecimento esse público já possui." },
  { id: "iterate", text: "Use a primeira resposta como rascunho e peça melhorias específicas na próxima rodada." },
  { id: "criteria", text: "Liste critérios de qualidade para a IA revisar a própria resposta antes de entregar." },
  { id: "questions", text: "Quando faltar contexto, peça para a IA fazer perguntas antes de responder." },
  { id: "steps", text: "Divida tarefas grandes em etapas menores e valide uma etapa por vez." },
  { id: "sources", text: "Para temas factuais, peça fontes e confira informações importantes antes de usar." },
  { id: "alternatives", text: "Peça três alternativas com vantagens e desvantagens antes de escolher uma direção." },
  { id: "tone", text: "Descreva o tom desejado com palavras concretas, como direto, acolhedor ou técnico." },
  { id: "negative", text: "Diga também o que deve ser evitado: clichês, jargão, repetição ou respostas longas." },
  { id: "data", text: "Separe claramente seus dados, instruções e exemplos usando títulos ou delimitadores." },
  { id: "verify", text: "Peça para a IA apontar suposições e incertezas em vez de inventar detalhes." },
  { id: "rewrite", text: "Ao revisar um texto, explique objetivo da mudança em vez de pedir apenas para melhorar." },
  { id: "compare", text: "Compare opções usando os mesmos critérios para tomar decisões mais consistentes." },
  { id: "checklist", text: "Transforme requisitos importantes em checklist para evitar itens esquecidos." },
  { id: "persona", text: "Combine papel, objetivo e público: essa tríade produz prompts mais precisos." },
  { id: "feedback", text: "Dê feedback concreto sobre o que funcionou e o que precisa mudar na resposta." },
  { id: "scope", text: "Feche o escopo antes de começar; pedidos menores costumam gerar resultados melhores." },
  { id: "structure", text: "Peça uma estrutura primeiro e desenvolva conteúdo somente depois de aprová-la." },
  { id: "assumptions", text: "Solicite uma lista de suposições para detectar interpretações erradas cedo." },
  { id: "examples", text: "Dois exemplos variados ensinam melhor o padrão do que uma explicação abstrata." },
  { id: "test", text: "Teste seu prompt com entradas diferentes para descobrir onde ele ainda é ambíguo." },
  { id: "privacy", text: "Não compartilhe senhas, documentos privados ou dados pessoais sensíveis com a IA." },
  { id: "summary", text: "Em tarefas longas, peça um resumo das decisões antes de seguir para a próxima etapa." },
  { id: "priority", text: "Ordene requisitos por prioridade para a IA saber o que preservar quando houver conflito." },
  { id: "final-review", text: "Antes de usar uma resposta, revise precisão, clareza e adequação ao seu objetivo." },
];
```

- [ ] **Step 4: Implementar seleção mínima**

```ts
import { DAILY_TIPS, type DailyTip } from "@/data/dailyTipsData";

const MS_PER_DAY = 86_400_000;

export function getLocalDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

export function getDailyTip(
  date = new Date(),
  tips: readonly DailyTip[] = DAILY_TIPS,
): DailyTip {
  if (tips.length === 0) {
    throw new Error("Daily tips catalog cannot be empty");
  }

  return tips[getLocalDayNumber(date) % tips.length];
}
```

- [ ] **Step 5: Executar teste e confirmar GREEN**

Run: `npm.cmd test -- src/lib/dailyTip.test.ts`

Expected: 5 tests PASS.

- [ ] **Step 6: Commit**

```powershell
git add -- src/data/dailyTipsData.ts src/lib/dailyTip.ts src/lib/dailyTip.test.ts
git commit -m "feat: add rotating daily tips"
```

### Task 2: Card da gatinha

**Files:**
- Create: `src/components/DailyTipCard.tsx`
- Test: `src/components/DailyTipCard.test.tsx`

- [ ] **Step 1: Escrever teste falhando**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DailyTipCard } from "@/components/DailyTipCard";

describe("DailyTipCard", () => {
  it("mostra título, dica e gatinha professora", () => {
    render(<DailyTipCard tip="Use contexto antes do pedido." />);

    expect(screen.getByRole("heading", { name: "Dica do dia" })).toBeInTheDocument();
    expect(screen.getByText("Use contexto antes do pedido.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Gatinha professora dando a dica do dia" }))
      .toHaveAttribute("src", "/assets/mascot-teacher.png");
  });
});
```

- [ ] **Step 2: Executar teste e confirmar RED**

Run: `npm.cmd test -- src/components/DailyTipCard.test.tsx`

Expected: FAIL porque componente ainda não existe.

- [ ] **Step 3: Implementar componente**

```tsx
interface DailyTipCardProps {
  tip: string;
}

export function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <section
      aria-labelledby="daily-tip-title"
      className="relative overflow-hidden rounded-2xl border-2 border-emerald/25 bg-gradient-to-br from-mint-50 to-card px-4 py-3 shadow-sm"
    >
      <div className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-emerald/10 blur-2xl" />
      <div className="relative flex items-center gap-3">
        <div className="flex h-20 w-20 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-card/70">
          <img
            src="/assets/mascot-teacher.png"
            alt="Gatinha professora dando a dica do dia"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1 rounded-2xl rounded-bl-md bg-card px-3.5 py-3 shadow-sm ring-1 ring-stroke-light">
          <h2
            id="daily-tip-title"
            className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-dark"
          >
            Dica do dia
          </h2>
          <p className="mt-1 text-sm font-semibold leading-snug text-foreground-dark">
            {tip}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Executar teste e confirmar GREEN**

Run: `npm.cmd test -- src/components/DailyTipCard.test.tsx`

Expected: 1 test PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/components/DailyTipCard.tsx src/components/DailyTipCard.test.tsx
git commit -m "feat: add daily tip mascot card"
```

### Task 3: Integração acima do nível

**Files:**
- Modify: `src/pages/Home.tsx`
- Test: `src/pages/Home.test.tsx`

- [ ] **Step 1: Escrever teste estrutural falhando**

```tsx
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Home daily tip placement", () => {
  it("renderiza DailyTipCard antes do card de nível", () => {
    const source = readFileSync(resolve("src/pages/Home.tsx"), "utf8");
    const dailyTipPosition = source.indexOf("<DailyTipCard");
    const levelPosition = source.indexOf("Nível {level}");

    expect(dailyTipPosition).toBeGreaterThan(-1);
    expect(levelPosition).toBeGreaterThan(-1);
    expect(dailyTipPosition).toBeLessThan(levelPosition);
  });
});
```

- [ ] **Step 2: Executar teste e confirmar RED**

Run: `npm.cmd test -- src/pages/Home.test.tsx`

Expected: FAIL porque `<DailyTipCard` ainda não aparece em `Home.tsx`.

- [ ] **Step 3: Integrar dica na Home**

Adicionar imports:

```ts
import { DailyTipCard } from "@/components/DailyTipCard";
import { getDailyTip } from "@/lib/dailyTip";
```

Dentro de `HomePage`, antes do `return`:

```ts
const dailyTip = getDailyTip();
```

Dentro de `<div className="flex-1 px-4 py-5 flex flex-col gap-5">`, antes do card cujo conteúdo começa com `Nível {level}`:

```tsx
<DailyTipCard tip={dailyTip.text} />
```

- [ ] **Step 4: Executar testes focados e confirmar GREEN**

Run: `npm.cmd test -- src/lib/dailyTip.test.ts src/components/DailyTipCard.test.tsx src/pages/Home.test.tsx`

Expected: 7 tests PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/pages/Home.tsx src/pages/Home.test.tsx
git commit -m "feat: show daily tip above home level"
```

### Task 4: Verificação completa e inspeção visual

**Files:**
- Modify only if verification reveals a defect.

- [ ] **Step 1: Executar suíte completa**

Run: `npm.cmd test`

Expected: todas suites PASS, 0 testes falhando.

- [ ] **Step 2: Executar typecheck**

Run: `npm.cmd run typecheck`

Expected: exit code 0.

- [ ] **Step 3: Executar lint**

Run: `npm.cmd run lint`

Expected: exit code 0, sem erros.

- [ ] **Step 4: Executar build**

Run: `npm.cmd run build`

Expected: exit code 0 e artefatos gerados em `dist`.

- [ ] **Step 5: Inspecionar Home em largura mobile e desktop**

Run: `npm.cmd run dev`

Abrir `/home` e confirmar:

- card aparece imediatamente acima do nível;
- mascote não corta rosto, chapéu ou ponteiro;
- texto permanece legível sem overflow;
- ordem visual funciona em mobile e desktop;
- foco e navegação existentes permanecem intactos.

- [ ] **Step 6: Verificar diff final**

Run: `git diff --check HEAD~3..HEAD && git status --short`

Expected: nenhum erro de whitespace; somente `.claude/settings.local.json` permanece não rastreado.
