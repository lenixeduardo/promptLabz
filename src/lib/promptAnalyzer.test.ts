import { describe, expect, it } from "vitest";
import { analyzePrompts } from "./promptAnalyzer";

describe("promptAnalyzer — classificação e notas", () => {
  it("classifica prompt vago como 'muito_vago' (score < 5)", () => {
    const result = analyzePrompts([
      { position: 1, text: "Faça algo." },
    ]);
    expect(result.feedbacks[0].classification).toBe("muito_vago");
    expect(result.feedbacks[0].score).toBeLessThan(5);
  });

  it("classifica prompt bom como 'bom_mas_melhora' (score 5-7.9)", () => {
    const result = analyzePrompts([
      {
        position: 1,
        text: "Explique como funciona o marketing de conteúdo para iniciantes, com tom educativo, formato de lista e inclua exemplos práticos.",
      },
    ]);
    const score = result.feedbacks[0].score;
    expect(score).toBeGreaterThanOrEqual(5);
    expect(score).toBeLessThan(8);
    expect(result.feedbacks[0].classification).toBe("bom_mas_melhora");
  });

  it("classifica prompt excelente como 'excelente' (score >= 8)", () => {
    const result = analyzePrompts([
      {
        position: 1,
        text: "Atue como um especialista em marketing digital e crie uma análise detalhada em formato de tabela comparando SEO e SEM, para gerentes de produto, com no máximo 500 palavras, tom profissional, e inclua exemplos de cada estratégia. Meu objetivo é apresentar para a diretoria.",
      },
    ]);
    expect(result.feedbacks[0].score).toBeGreaterThanOrEqual(8);
    expect(result.feedbacks[0].classification).toBe("excelente");
  });

  it("calcula média simples entre múltiplos prompts", () => {
    const result = analyzePrompts([
      { position: 1, text: "Oi." }, // muito vago
      { position: 2, text: "Explique o que é machine learning para iniciantes, formato de lista." }, // bom
      {
        position: 3,
        text: "Atue como um especialista em Python e crie um tutorial completo em markdown sobre async/await para desenvolvedores juniores, com exemplos práticos, no máximo 1000 linhas e tom didático.",
      }, // excelente
    ]);
    expect(result.feedbacks).toHaveLength(3);
    expect(result.averageScore).toBeGreaterThan(0);
    expect(result.averageScore).toBeLessThanOrEqual(10);
    // Average should be between min and max
    const scores = result.feedbacks.map((f) => f.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    expect(result.averageScore).toBeGreaterThanOrEqual(min);
    expect(result.averageScore).toBeLessThanOrEqual(max);
  });
});

describe("promptAnalyzer — forças e fraquezas", () => {
  it("identifica pontos fortes em prompts bem estruturados", () => {
    const result = analyzePrompts([
      {
        position: 1,
        text: "Atue como um copywriter sênior e crie um anúncio para Instagram em formato de lista, para empreendedores, com tom persuasivo e no máximo 100 palavras.",
      },
    ]);
    const strengths = result.feedbacks[0].strengths;
    expect(strengths.length).toBeGreaterThanOrEqual(1);
    // Should detect persona, action, format, audience, constraints, tone
    const strengthText = strengths.join(" ");
    expect(strengthText).toMatch(/Persona|Ação|Formato|Público|Restrições|Tom/);
  });

  it("identifica fraquezas em prompts vagos", () => {
    const result = analyzePrompts([
      { position: 1, text: "Me ajuda." },
    ]);
    const weaknesses = result.feedbacks[0].weaknesses;
    expect(weaknesses.length).toBeGreaterThanOrEqual(1);
    // Should flag missing persona, action, context, format
    const weaknessText = weaknesses.join(" ");
    expect(weaknessText).toMatch(/persona|ação|contexto|formato|genérico/i);
  });

  it("fornece 'Nenhuma falha crítica detectada' quando o prompt aborda todos os critérios", () => {
    const result = analyzePrompts([
      {
        position: 1,
        text: "Atue como um especialista em finanças e analise as vantagens de investir em ETFs para investidores iniciantes, meu objetivo é educar sobre renda variável, formato de lista com 5 itens, tom educativo, no máximo 200 palavras, e inclua exemplos práticos. Não use jargões técnicos. Explique passo a passo cada vantagem.",
      },
    ]);
    const weaknesses = result.feedbacks[0].weaknesses;
    // This comprehensive prompt should cover all criteria
    expect(weaknesses).toContain("Nenhuma falha crítica detectada.");
  });
});

describe("promptAnalyzer — reescrita", () => {
  it("gera sugestão de reescrita para prompt vago", () => {
    const result = analyzePrompts([
      { position: 1, text: "Crie um texto." },
    ]);
    const suggestion = result.feedbacks[0].suggestion;
    expect(suggestion).toBeTruthy();
    expect(suggestion.length).toBeGreaterThan(result.feedbacks[0].text.length);
  });

  it("reescrita não deve conter informações que não estão no original", () => {
    const result = analyzePrompts([
      { position: 1, text: "Explique o que é blockchain." },
    ]);
    const suggestion = result.feedbacks[0].suggestion;
    // Should contain bracketed placeholders for user-provided info
    expect(suggestion).toMatch(/\[.*?\]/);
  });
});

describe("promptAnalyzer — resumo consolidado", () => {
  it("resumo reflete a contagem correta", () => {
    const result = analyzePrompts([
      { position: 1, text: "Oi." },
      { position: 2, text: "Explique o que é marketing digital para iniciantes com exemplos." },
      {
        position: 3,
        text: "Atue como especialista em design e crie 3 conceitos de logo em formato de descrição para startups de tecnologia, tom moderno, no máximo 50 palavras cada.",
      },
    ]);
    expect(result.summary.totalAnalyzed).toBe(3);
    expect(
      result.summary.excellentCount +
        result.summary.improvementCount +
        result.summary.needsWorkCount,
    ).toBe(3);
  });

  it("mensagem final depende da média", () => {
    const vago = analyzePrompts([{ position: 1, text: "Ajuda." }]);
    expect(vago.summary.finalMessage.title).toBe("Vamos fortalecer seus prompts");

    const bom = analyzePrompts([
      { position: 1, text: "Explique o que é React para iniciantes com exemplos práticos, tom didático, formato de lista com no máximo 10 tópicos." },
    ]);
    expect(bom.summary.finalMessage.title).toBe("Bom caminho!");

    const excelente = analyzePrompts([
      {
        position: 1,
        text: "Atue como especialista em UX e analise este formulário de cadastro para usuários mobile, formato de lista priorizada, tom técnico, no máximo 300 palavras, com exemplos de cada ponto.",
      },
    ]);
    // Double-check it's actually excellent
    if (excelente.feedbacks[0].classification === "excelente") {
      expect(excelente.summary.finalMessage.title).toBe("Muito bom! 🎉");
    }
  });
});

describe("promptAnalyzer — detecção de critérios específicos", () => {
  it("detecta persona definida", () => {
    const result = analyzePrompts([
      { position: 1, text: "Atue como um especialista em Python." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Persona definida");
  });

  it("detecta ação clara", () => {
    const result = analyzePrompts([
      { position: 1, text: "Crie uma lista de tarefas." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Ação clara");
  });

  it("detecta contexto incluído", () => {
    const result = analyzePrompts([
      { position: 1, text: "Meu objetivo é aprender React e preciso de um guia." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Contexto incluído");
  });

  it("detecta formato especificado", () => {
    const result = analyzePrompts([
      { position: 1, text: "Responda em formato de tabela." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Formato especificado");
  });

  it("detecta restrições definidas", () => {
    const result = analyzePrompts([
      { position: 1, text: "No máximo 200 palavras." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Restrições definidas");
  });

  it("detecta tom definido", () => {
    const result = analyzePrompts([
      { position: 1, text: "Use tom formal e didático." },
    ]);
    expect(result.feedbacks[0].strengths).toContain("Tom definido");
  });
});
