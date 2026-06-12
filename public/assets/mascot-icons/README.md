# Mascot Icons Collection

Uma coleção de 20 ícones educacionais temáticos com mascotes (personagens com óculos e expressões) em estilo minimalista verde.

## Ícones Disponíveis

| Nome | Arquivo | Descrição |
|------|---------|-----------|
| **Livro** | `mascot_book.svg` | Mascote lendo um livro - para aprendizado geral |
| **Formatura** | `mascot_graduation.svg` | Mascote com chapéu de formatura - para conclusão/sucesso |
| **Lâmpada** | `mascot_lightbulb.svg` | Mascote com ideia brilhante - para criatividade/insights |
| **Código** | `mascot_code.svg` | Mascote com chaves de código - para desenvolvimento |
| **Foguete** | `mascot_rocket.svg` | Mascote lançando foguete - para crescimento/velocidade |
| **Troféu** | `mascot_trophy.svg` | Mascote com troféu - para conquistas |
| **Quebra-cabeça** | `mascot_puzzle.svg` | Mascote com peças de puzzle - para resolução de problemas |
| **Paleta** | `mascot_palette.svg` | Mascote artista com paleta - para design/criatividade |
| **Gráfico** | `mascot_chart.svg` | Mascote com gráfico crescente - para análise/progresso |
| **Cérebro** | `mascot_brain.svg` | Mascote pensando com cérebro - para inteligência/estratégia |
| **Alvo** | `mascot_target.svg` | Mascote com alvo - para metas/objetivos |
| **Coração** | `mascot_heart.svg` | Mascote com coração - para paixão/dedicação |
| **Estrela** | `mascot_star.svg` | Mascote com estrela - para excelência |
| **Missão** | `mascot_quest.svg` | Mascote com mapa - para jornada/aventura |
| **Medalha** | `mascot_medal.svg` | Mascote com medalha - para honra/reconhecimento |
| **Coroa** | `mascot_crown.svg` | Mascote com coroa - para liderança |
| **Crescimento** | `mascot_growth.svg` | Mascote com árvore em crescimento - para desenvolvimento |
| **Rede** | `mascot_network.svg` | Mascote com nós de rede - para comunidade/conexão |
| **Foco** | `mascot_focus.svg` | Mascote concentrado - para dedicação/determinação |
| **Equipe** | `mascot_team.svg` | Mascote com time - para colaboração/grupo |
| **Celebração** | `mascot_celebrate.svg` | Mascote celebrando - para vitória/felicidade |

## Características de Design

- **Estilo**: Minimalista, amigável e educacional
- **Cores principais**:
  - Verde primário: `#3E8E5E`
  - Verde escuro: `#2E7048`
  - Acentos: variadas (ouro, vermelho, azul, roxo)
- **Tamanho**: Otimizado para exibição em 64x64px
- **Responsivo**: Funciona em qualquer tamanho via SVG

## Como Usar

### Em Componentes React

```tsx
// Importar imagem SVG
import mascotBookIcon from '@/assets/mascot-icons/mascot_book.svg'

// Usar em um componente
<img 
  src={mascotBookIcon} 
  alt="Mascote estudando" 
  className="h-16 w-16"
/>

// Ou com URL relativa (melhor performance)
<img 
  src="/assets/mascot-icons/mascot_book.svg" 
  alt="Mascote estudando" 
  className="h-16 w-16"
/>
```

### Em Tailwind CSS

```tsx
// Com classes de tamanho
<img 
  src="/assets/mascot-icons/mascot_growth.svg" 
  className="h-24 w-24 object-contain"
/>

// Com animações
<img 
  src="/assets/mascot-icons/mascot_rocket.svg" 
  className="h-16 w-16 animate-bounce"
/>
```

### Exemplo Completo

```tsx
<div className="flex items-center gap-3 rounded-lg bg-white p-4">
  <img 
    src="/assets/mascot-icons/mascot_trophy.svg" 
    alt="Conquistas" 
    className="h-12 w-12"
  />
  <div>
    <h3 className="font-semibold text-[#1F2A24]">Conquista Desbloqueada!</h3>
    <p className="text-sm text-[#6B7A70]">Você completou 10 lições</p>
  </div>
</div>
```

## Integração em Páginas

Os ícones estão integrados em:

1. **Home** (`src/pages/Home.tsx`):
   - Usa `mascot_lightbulb.svg` na seção "Continue Aprendendo"

2. **Achievements** (`src/pages/Achievements.tsx`):
   - Usa `mascot_celebrate.svg` no cabeçalho de conquistas

3. **Skills** (`src/pages/Skills.tsx`):
   - Usa `mascot_growth.svg` no estado vazio

4. **MascotGlow** (`src/components/MascotGlow.tsx`):
   - Wrapper para destacar qualquer mascote com efeitos de brilho

## Convenção de Nomes

Todos os ícones seguem o padrão: `mascot_[temática].svg`

- Usar snake_case para separar palavras
- Nomes descritivos em inglês
- Prefixo consistente: `mascot_`

## Performance

- Arquivos SVG otimizados e minificados
- Peso total: ~15KB para todos os 20 ícones
- Carregamento nativo sem dependências
- Escalável sem perda de qualidade

## Acessibilidade

Todos os ícones devem incluir atributos `alt` descritivos:

```tsx
<img 
  src="/assets/mascot-icons/mascot_code.svg" 
  alt="Mascote programando com código"
  className="h-12 w-12"
/>
```

## Customização

Para modificar cores ou estilos de um ícone específico:

1. Abra o arquivo SVG em um editor de texto
2. Modifique os valores de `fill`, `stroke` ou `stroke-width`
3. Salve e teste no navegador

Cores recomendadas:
- Verde primário: `#3E8E5E`
- Verde escuro: `#2E7048`
- Ouro: `#FFD700`
- Vermelho: `#FF6B6B`
- Azul: `#4A90E2`
- Roxo: `#7C5CFF`

## Próximos Passos

- Adicionar mais variações (expressões diferentes)
- Criar versão em estilo flat design
- Exportar como fonte de ícones
- Animar alguns ícones com CSS/SVG animations
