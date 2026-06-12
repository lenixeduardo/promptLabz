# PromptLabz — Definição de Produto

## Declaração do Problema

**"Ajuda estudantes e criadores iniciantes a praticar prompts e habilidades de IA sem depender de aulas soltas ou progresso manual."**

---

## Usuários-Alvo

### Primário: Estudante em Transição de Carreira
- Pessoa entre 20–35 anos querendo entrar na área de tecnologia ou IA
- Sente que "precisa aprender tudo" mas não sabe por onde começar
- Prefere aprender fazendo, com feedback imediato
- Usa celular para estudar nos intervalos do trabalho

### Secundário: Criador de Conteúdo Iniciante
- Influenciador ou freelancer que quer usar IA nas suas criações
- Não tem background técnico
- Quer templates prontos e habilidades práticas
- Aprende melhor com exemplos do mundo real

### Terciário: Desenvolvedor Júnior
- Programador iniciante que quer melhorar produtividade com IA
- Já usa ferramentas como GitHub Copilot mas quer dominar prompt engineering
- Busca skills específicas para seu stack

---

## MVP — 5 Funcionalidades Principais

1. **Autenticação**: Login/Signup com email+senha, Google OAuth e Apple OAuth
2. **Trilhas de Aprendizado**: Módulos sequenciais com lições interativas
3. **Central de Skills**: Catálogo navegável de 80+ skills com busca, filtro e favoritos
4. **Sistema de Vidas**: Mecânica gamificada que penaliza erros e incentiva foco
5. **Perfil e Progresso**: Acompanhamento de lições concluídas, salvo local e na nuvem

---

## Requisitos Funcionais

| # | Requisito | Prioridade |
|---|-----------|-----------|
| RF01 | Usuário pode criar conta com email/senha | Alta |
| RF02 | Usuário pode fazer login com Google | Alta |
| RF03 | Usuário pode resetar senha via email | Alta |
| RF04 | Progresso é salvo automaticamente | Alta |
| RF05 | Lições têm resposta correta/incorreta com feedback | Alta |
| RF06 | Skills podem ser buscadas por nome, autor, tag | Alta |
| RF07 | Usuário pode favoritar skills | Média |
| RF08 | Ranking de skills por instalações | Média |
| RF09 | Sistema de conquistas (achievements) | Média |
| RF10 | Perfil com avatar customizável | Média |
| RF11 | Email de boas-vindas personalizado | Baixa |
| RF12 | Suporte a premium/plano pago | Baixa (futuro) |

---

## Requisitos Não-Funcionais

| # | Requisito | Meta |
|---|-----------|------|
| RNF01 | Performance: First Contentful Paint | < 1.5s |
| RNF02 | Build size (chunk principal) | < 500 kB |
| RNF03 | Disponibilidade | 99.5% uptime |
| RNF04 | Responsividade | Mobile-first, funciona em 320px+ |
| RNF05 | Acessibilidade | WCAG AA (foco visível, contraste, labels) |
| RNF06 | Segurança: senhas | Hash via Supabase Auth (bcrypt) |
| RNF07 | Segurança: RLS | Usuário só acessa seus próprios dados |
| RNF08 | SEO | Meta tags básicas, título dinâmico |

---

## Regras de Negócio

### Autenticação
- Email deve ser válido (formato RFC 5322)
- Senha mínimo 6 caracteres
- Conta inativa por 90+ dias pode ser arquivada
- OAuth retorna para `/auth/callback`, redirecionando para `/home`

### Progresso
- Progresso é salvo no `localStorage` imediatamente (offline-first)
- Sincroniza com Supabase quando há conexão e usuário autenticado
- Legado: chaves antigas (`promptlab_progress`) são migradas automaticamente
- Lição só é marcada como completa ao responder corretamente

### Vidas
- Usuário começa com 5 vidas
- Perde 1 vida por resposta errada
- Vidas se regeneram com o tempo (1 a cada 30 min)
- Com 0 vidas, não pode iniciar nova lição (deve esperar regeneração)

### Favoritos
- Favoritos salvos em `localStorage` por nome de skill
- Sem limite de favoritos
- Favoritar a 1ª skill desbloqueia conquista "Primeiro Favorito"

### Conquistas
- Verificadas no cliente após cada ação relevante (lição, favorito, categoria visitada)
- Uma conquista desbloqueada não pode ser "revertida"
- Em DEV: log no console ao desbloquear

### Premium (planejado)
- Campos `premium_status`, `stripe_customer_id`, `trial_ends_at` existem no DB
- Update desses campos é bloqueado no cliente via RLS (só backend/webhook)
- Status possíveis: `free` | `trial` | `active` | `cancelled`

---

## Transições de Estado

```
[Anônimo] → Signup/Login → [Autenticado]
[Autenticado] → Logout → [Anônimo]
[Autenticado] → Inicia Lição → [Em Lição]
[Em Lição] → Resposta Correta → [Lição Completa]
[Em Lição] → Resposta Errada + Vidas > 0 → [Em Lição] (perde vida)
[Em Lição] → Resposta Errada + Vidas = 0 → [Bloqueado] (aguarda regeneração)
[Lição Completa] → Último da Trilha → [Missão Completa]
```

---

## Casos de Borda Mapeados

### Conectividade
- **Sem internet ao salvar progresso**: salva local, sincroniza ao reconectar
- **Token expirado**: Supabase renova automaticamente; se falhar, redireciona para login
- **Supabase offline**: app funciona em modo degradado (só localStorage)

### Dados Inválidos
- **Email mal formatado no signup**: erro inline no campo
- **Senha muito curta**: erro inline antes de chamar API
- **Nome vazio no perfil**: aceito (campo opcional)
- **Avatar URL inválida**: fallback para avatar padrão

### Limite de Recursos
- **Sem vidas restantes**: botão "Iniciar Lição" desabilitado com contador
- **Categoria sem lições**: empty state com mensagem amigável
- **Skill não encontrada na busca**: empty state com mascote "puzzle"
- **Nenhuma skill favoritada**: empty state explicativo

### Erros de API
- **Falha no signup**: mensagem de erro localizada no toast
- **Email já cadastrado**: mensagem específica "Este email já está em uso"
- **Credenciais inválidas no login**: mensagem genérica (não revela se email existe)
- **Erro no OAuth**: redireciona para `/login` com parâmetro de erro
- **Rate limit do Supabase**: `429` é capturado e exibe "Tente novamente em alguns segundos"

### Edge Cases de UI
- **Clique duplo em submit**: botão é desabilitado durante loading
- **Navegação com back button**: estado da lição é preservado no router
- **Reload durante lição**: progresso local é restaurado do localStorage
- **Múltiplas abas**: a última a salvar prevalece (sem conflito ativo)
