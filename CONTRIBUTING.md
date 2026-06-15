# Contribuindo com o PromptLabz

Obrigado pelo interesse em contribuir! Este guia cobre o processo de desenvolvimento, convenções de código e como submeter mudanças.

---

## Pré-requisitos

- Node.js 22+
- pnpm 9+
- Conta no Supabase (para rodar com backend)
- Git configurado

---

## Configuração do Ambiente

```bash
# 1. Clone o repositório
git clone https://github.com/lenixeduardo/promptLab.git
cd promptLab

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. (Opcional) Inicie o Supabase local
supabase start
supabase db reset
# Copie a URL e anon key exibidas para .env.local

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

---

## Fluxo de Trabalho

### Branches

Usamos o seguinte padrão de branches:

```
main              # Produção (protegida, merge via PR)
feat/nome-feature # Nova funcionalidade
fix/nome-bug      # Correção de bug
refactor/nome     # Refatoração sem mudança de comportamento
docs/nome         # Documentação
```

### Processo

1. Crie uma issue descrevendo o que você quer fazer
2. Crie um branch a partir de `main`
3. Desenvolva e faça commits com mensagens claras
4. Abra um Pull Request descrevendo as mudanças
5. Aguarde review e CI passar
6. Merge via squash após aprovação

---

## Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona busca por tags na central de skills
fix: corrige logout não redirecionando para /
refactor: extrai SkillCard para componente separado
docs: adiciona exemplos de uso na seção de Skills
test: adiciona testes para useFavorites hook
chore: atualiza dependências para versão mais recente
```

---

## Estrutura de Código

### Componentes React
- Um componente por arquivo
- Nome do arquivo = nome do componente (PascalCase)
- Props tipadas com interface acima do componente

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
```

### Hooks
- Prefixo `use`
- Retornam objeto nomeado (não array, a menos que seja `useState`-like)
- Lógica de negócio fica no hook, não no componente

### Estilos
- Tailwind CSS para tudo
- Sem arquivos CSS separados por componente
- Usar `cn()` de `@/lib/utils` para classes condicionais

```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class")} />
```

---

## Testes

### Rodando Testes

```bash
pnpm test           # Roda uma vez
pnpm test:watch     # Watch mode
pnpm test:coverage  # Com relatório de cobertura
```

### Escrevendo Testes

- Use Vitest + React Testing Library
- Arquivos de teste: `*.test.ts` ou `*.test.tsx` junto ao arquivo testado
- Nomeie os describes em português (padrão do projeto)
- Priorize testes de comportamento (o que o usuário vê/faz), não implementação

```tsx
describe("Login — submissão", () => {
  it("navega para /home ao fazer login com sucesso", async () => {
    // arrange
    mockLogin.mockResolvedValue({ success: true, user: { email: "a@a.com" } })
    renderLogin()

    // act
    await userEvent.type(screen.getByPlaceholderText("Seu e-mail"), "a@a.com")
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))

    // assert
    await waitFor(() => expect(screen.getByText("home")).toBeInTheDocument())
  })
})
```

### Mocks
- Mocke o Supabase client com `vi.mock("@/lib/supabase", ...)`
- Mocke hooks externos com `vi.mock("@/hooks/useAuth", ...)`
- Não mocke funções internas que você quer testar

---

## Pipeline de CI

Ao abrir um PR, o GitHub Actions executa automaticamente:

```
typecheck → lint → test → build
```

Todo o pipeline deve passar antes do merge. Se falhar, verifique o log na aba Actions do PR.

---

## Adicionando Novas Skills

As skills ficam em `skills/` organizadas por categoria:

```
skills/
├── development/
├── design/
├── marketing/
├── productivity/
├── ai-media/
├── cloud/
└── agent-workflows/
```

Cada skill é um arquivo Markdown com frontmatter:

```markdown
---
name: "Nome da Skill"
description: "Descrição em 1-2 frases"
author: "Seu Nome"
category: "Desenvolvimento"
tags: ["tag1", "tag2"]
installs: "1.2k"
---

# Conteúdo da skill aqui
```

Após criar o arquivo, registre a skill em `src/data/trendingSkillsData.ts`.

---

## Adicionando Novas Lições

As lições ficam em `src/data/lessonsData.ts`. Cada lição tem a estrutura:

```typescript
{
  id: "unique-id",
  title: "Título da Lição",
  content: "Conteúdo explicativo",
  question: "Pergunta da lição",
  options: ["Opção A", "Opção B", "Opção C", "Opção D"],
  correctIndex: 0, // índice da opção correta
  explanation: "Explicação por que a resposta está correta"
}
```

---

## Dúvidas?

Abra uma issue com a label `question` ou entre em contato pelo email do projeto.
