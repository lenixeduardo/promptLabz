import { describe, expect, it } from "vitest";
import { parseContent } from "./promptParser";

describe("promptParser — ChatGPT format", () => {
  it("extrai mensagens do usuário no formato ChatGPT", () => {
    const content = `User: Crie um texto sobre marketing.
ChatGPT: Aqui está um texto sobre marketing.
User: Explique SEO para iniciantes.
ChatGPT: SEO significa Search Engine Optimization.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].text).toBe("Crie um texto sobre marketing.");
    expect(result.messages[1].text).toBe("Explique SEO para iniciantes.");
    expect(result.fallback).toBe(false);
  });

  it("usa fallback quando não encontra marcadores", () => {
    const content = "Este é apenas um texto qualquer sem marcadores de conversa.";
    const result = parseContent(content);
    expect(result.fallback).toBe(true);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe(content);
  });

  it("reconhece marcador You:", () => {
    const content = `You: Me dê dicas de produtividade.
Assistant: Claro! Aqui vão algumas dicas.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe("Me dê dicas de produtividade.");
  });

  it("reconhece marcador Usuário:", () => {
    const content = `Usuário: Qual a capital do Brasil?
ChatGPT: A capital do Brasil é Brasília.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe("Qual a capital do Brasil?");
  });

  it("reconhece marcador Você:", () => {
    const content = `Você: Traduza para o inglês.
Model: Here is the translation.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toBe("Traduza para o inglês.");
  });
});

describe("promptParser — Claude format", () => {
  it("extrai mensagens Human:", () => {
    const content = `Human: Quero aprender Python.
Claude: Ótima escolha! Python é uma linguagem versátil.
Human: Quais os primeiros passos?
Claude: Comece com variáveis e tipos de dados.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].text).toBe("Quero aprender Python.");
    expect(result.messages[1].text).toBe("Quais os primeiros passos?");
  });

  it("ignora mensagens do assistente", () => {
    const content = `Human: Crie um plano de estudos.
Claude: Aqui está um plano detalhado.
Human: Adicione mais exercícios.
Claude: Claro, aqui estão mais exercícios.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(2);
    // Assistant messages (Claude:) should NOT be included
    expect(result.messages.every((m) => m.text.length > 0)).toBe(true);
    expect(result.messages[0].text).toBe("Crie um plano de estudos.");
  });
});

describe("promptParser — Gemini format", () => {
  it("extrai mensagens do usuário no formato Gemini", () => {
    const content = `You: Me explique o que é machine learning.
Gemini: Machine learning é um ramo da IA.
You: Dê um exemplo prático.
Gemini: Um exemplo é recomendação de filmes.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].text).toBe("Me explique o que é machine learning.");
  });
});

describe("promptParser — limite de 50 prompts", () => {
  it("cap em 50 mensagens quando há mais de 50", () => {
    const lines: string[] = [];
    for (let i = 0; i < 55; i++) {
      lines.push(`User: Mensagem número ${i + 1}.`);
      lines.push(`Assistant: Resposta ${i + 1}.`);
    }
    const content = lines.join("\n");
    const result = parseContent(content);
    expect(result.messages).toHaveLength(50);
    expect(result.capped).toBe(true);
    expect(result.totalFound).toBe(55);
    expect(result.warning).toBe("Limite de 50 prompts aplicado");
  });

  it("não cap quando há exatamente 50 mensagens", () => {
    const lines: string[] = [];
    for (let i = 0; i < 50; i++) {
      lines.push(`User: Mensagem ${i + 1}.`);
      lines.push(`Assistant: Resposta ${i + 1}.`);
    }
    const content = lines.join("\n");
    const result = parseContent(content);
    expect(result.messages).toHaveLength(50);
    expect(result.capped).toBe(false);
  });
});

describe("promptParser — preservação de ordem", () => {
  it("preserva a ordem original das mensagens do usuário", () => {
    const content = `User: Primeira mensagem.
Assistant: Resposta 1.
User: Segunda mensagem.
Assistant: Resposta 2.
User: Terceira mensagem.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(3);
    expect(result.messages[0].text).toBe("Primeira mensagem.");
    expect(result.messages[1].text).toBe("Segunda mensagem.");
    expect(result.messages[2].text).toBe("Terceira mensagem.");
  });
});

describe("promptParser — conteúdo vazio", () => {
  it("retorna fallback para conteúdo vazio", () => {
    const result = parseContent("");
    expect(result.messages).toHaveLength(0);
  });

  it("retorna fallback para espaços em branco", () => {
    const result = parseContent("   \n  \n  ");
    expect(result.messages).toHaveLength(0);
  });
});

describe("promptParser — quebras de linha e markdown", () => {
  it("preserva markdown interno dentro da mensagem do usuário", () => {
    const content = `User: Crie um artigo com os seguintes tópicos:

**Título:** Machine Learning
**Subtítulo:** Introdução

- O que é ML
- Tipos de aprendizado
- Exemplos práticos

Assistant: Aqui está o artigo completo.`;
    const result = parseContent(content);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].text).toContain("**Título:**");
    expect(result.messages[0].text).toContain("O que é ML");
    expect(result.messages[0].text).toContain("Exemplos práticos");
  });
});

describe("promptParser — posições corretas", () => {
  it("atribui posições 1-based na ordem correta", () => {
    const content = `User: Primeiro.
Assistant: R1.
User: Segundo.
Assistant: R2.
User: Terceiro.`;
    const result = parseContent(content);
    expect(result.messages[0].position).toBe(1);
    expect(result.messages[1].position).toBe(2);
    expect(result.messages[2].position).toBe(3);
  });
});
