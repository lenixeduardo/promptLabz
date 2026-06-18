#!/usr/bin/env node
// Generates Obsidian vault markdown files from Supabase data.
// Runs after the skills-prompts-sync Edge Function in the GitHub Actions workflow.
// Usage: SUPABASE_URL=... SUPABASE_ANON_KEY=... node generate-vault.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const VAULT_DIR = join(__dirname, "../../vault")

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "")
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// ── Supabase REST helper ──────────────────────────────────────────────────────

async function supabaseSelect(table, columns = "*", filters = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${columns}${filters ? `&${filters}` : ""}&order=trending_score.desc.nullslast`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${await res.text()}`)
  return res.json()
}

// ── File helpers ──────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[&]/g, "e")
    .replace(/[^a-z0-9\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function safeFolderName(category) {
  return category.replace(/[&]/g, "e").replace(/\s+/g, "-")
}

function writeVaultFile(relPath, content) {
  const fullPath = join(VAULT_DIR, relPath)
  mkdirSync(dirname(fullPath), { recursive: true })

  let existing = ""
  try { existing = readFileSync(fullPath, "utf8") } catch { /* new file */ }
  if (existing === content) return false // unchanged

  writeFileSync(fullPath, content, "utf8")
  return true
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

// ── Skills vault generation ───────────────────────────────────────────────────

function buildSkillNote(skill) {
  const tags = (skill.tags ?? []).map((t) => `#${t.replace(/\s+/g, "-")}`).join(" ")
  const trending = skill.trending_score >= 70 ? "true" : "false"

  return `---
name: ${skill.name}
description: "${(skill.description ?? "").replace(/"/g, "'")}"
author: ${skill.author ?? "unknown"}
category: ${skill.category}
installs: "${skill.installs ?? "0"}"
installs_count: ${skill.installs_count ?? 0}
trending: ${trending}
trending_score: ${skill.trending_score ?? 0}
source_url: "${skill.source_url ?? ""}"
external_id: ${skill.external_id ?? ""}
tags: [${(skill.tags ?? []).map((t) => `"${t}"`).join(", ")}]
icon: "${skill.icon ?? "🔧"}"
added: ${today()}
---

# ${skill.icon ?? "🔧"} ${skill.name}

> ${skill.description ?? ""}

## Detalhes

| Campo | Valor |
|-------|-------|
| Autor | ${skill.author ?? "—"} |
| Categoria | [[skills/${safeFolderName(skill.category)}/_index\|${skill.category}]] |
| Instalações | ${skill.installs ?? "0"} |
| Trending Score | ${skill.trending_score ?? 0}/100 |

## Tags

${tags || "#skill"}

## Referências

${skill.source_url ? `- [Repositório](${skill.source_url})` : ""}
- [[skills/_index|← Voltar para Skills]]
`
}

async function generateSkillsVault(skills) {
  let written = 0

  // Category index files
  const byCategory = {}
  for (const skill of skills) {
    const cat = skill.category ?? "Outros"
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(skill)
  }

  for (const [category, catSkills] of Object.entries(byCategory)) {
    const folder = safeFolderName(category)
    const rows = catSkills
      .map((s) => `| [[skills/${folder}/${slugify(s.name)}\|${s.name}]] | ${s.author ?? "—"} | ${s.installs ?? "0"} | ${s.trending_score ?? 0} |`)
      .join("\n")

    const indexContent = `---
category: ${category}
type: skills-index
updated: ${today()}
---

# ${category}

> Todas as skills da categoria **${category}** indexadas automaticamente.

## Skills (${catSkills.length})

| Skill | Autor | Instalações | Score |
|-------|-------|------------|-------|
${rows}

---
[[skills/_index|← Voltar ao índice geral de Skills]]
`
    if (writeVaultFile(`skills/${folder}/_index.md`, indexContent)) written++

    for (const skill of catSkills) {
      const filename = `skills/${folder}/${slugify(skill.name)}.md`
      if (writeVaultFile(filename, buildSkillNote(skill))) written++
    }
  }

  // Global skills index
  const categoryLinks = Object.keys(byCategory)
    .map((cat) => `- [[skills/${safeFolderName(cat)}/_index|${cat}]] (${byCategory[cat].length})`)
    .join("\n")

  const trending = skills.filter((s) => (s.trending_score ?? 0) >= 70)
    .slice(0, 10)
    .map((s) => `- [[skills/${safeFolderName(s.category)}/${slugify(s.name)}|${s.icon ?? "🔧"} ${s.name}]] — score ${s.trending_score}`)
    .join("\n")

  const globalIndex = `---
type: skills-index
updated: ${today()}
total: ${skills.length}
---

# Skills — Índice Geral

> Base de conhecimento de skills para Claude Code, sincronizada automaticamente a cada 3 dias.

## Categorias (${Object.keys(byCategory).length})

${categoryLinks}

## 🔥 Trending Skills

${trending || "_Nenhuma skill com score alto ainda._"}

---

\`\`\`dataview
TABLE icon + " " + name AS "Skill", author AS "Autor", installs AS "Instalações", trending_score AS "Score"
FROM "skills"
WHERE type != "skills-index"
SORT trending_score DESC
LIMIT 20
\`\`\`
`
  if (writeVaultFile("skills/_index.md", globalIndex)) written++
  return written
}

// ── Prompts vault generation ──────────────────────────────────────────────────

function buildPromptNote(prompt) {
  const colorMap = { green: "🟢 Iniciante", yellow: "🟡 Intermediário", red: "🔴 Avançado" }
  const badge = colorMap[prompt.color] ?? prompt.difficulty

  return `---
title: "${(prompt.title ?? "").replace(/"/g, "'")}"
category: ${prompt.category}
difficulty: ${prompt.difficulty}
color: ${prompt.color}
trending: ${(prompt.trending_score ?? 0) >= 60 ? "true" : "false"}
trending_score: ${prompt.trending_score ?? 0}
source_url: "${prompt.source_url ?? ""}"
external_id: ${prompt.external_id ?? ""}
added: ${today()}
tags: [prompt, ${slugify(prompt.category)}, ${slugify(prompt.difficulty)}]
---

# ${prompt.title}

> ${prompt.description ?? ""}

**Nível:** ${badge}
**Categoria:** [[prompts/${safeFolderName(prompt.category)}/_index|${prompt.category}]]

## Prompt

\`\`\`
${prompt.prompt_text ?? ""}
\`\`\`

${prompt.example_input ? `## Exemplo de Entrada\n\n${prompt.example_input}\n` : ""}
${prompt.example_output ? `## Exemplo de Saída\n\n${prompt.example_output}\n` : ""}
## Referências

${prompt.source_url ? `- [Fonte](${prompt.source_url})` : ""}
- [[prompts/_index|← Voltar para Prompts]]
`
}

async function generatePromptsVault(prompts) {
  let written = 0

  const byCategory = {}
  for (const prompt of prompts) {
    const cat = prompt.category ?? "Outros"
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(prompt)
  }

  for (const [category, catPrompts] of Object.entries(byCategory)) {
    const folder = safeFolderName(category)
    const rows = catPrompts
      .map((p) => {
        const badge = p.color === "green" ? "🟢" : p.color === "yellow" ? "🟡" : "🔴"
        return `| [[prompts/${folder}/${slugify(p.title)}\|${p.title}]] | ${badge} ${p.difficulty} | ${p.trending_score ?? 0} |`
      })
      .join("\n")

    const indexContent = `---
category: ${category}
type: prompts-index
updated: ${today()}
---

# ${category}

> Todos os prompts da categoria **${category}**.

## Prompts (${catPrompts.length})

| Prompt | Nível | Score |
|--------|-------|-------|
${rows}

---
[[prompts/_index|← Voltar ao índice geral de Prompts]]
`
    if (writeVaultFile(`prompts/${folder}/_index.md`, indexContent)) written++

    for (const prompt of catPrompts) {
      const filename = `prompts/${folder}/${slugify(prompt.title)}.md`
      if (writeVaultFile(filename, buildPromptNote(prompt))) written++
    }
  }

  // Global prompts index
  const categoryLinks = Object.keys(byCategory)
    .map((cat) => `- [[prompts/${safeFolderName(cat)}/_index|${cat}]] (${byCategory[cat].length})`)
    .join("\n")

  const trending = prompts
    .filter((p) => (p.trending_score ?? 0) >= 60)
    .slice(0, 10)
    .map((p) => `- [[prompts/${safeFolderName(p.category)}/${slugify(p.title)}|${p.title}]] — ${p.category}`)
    .join("\n")

  const globalIndex = `---
type: prompts-index
updated: ${today()}
total: ${prompts.length}
---

# Prompts — Índice Geral

> Biblioteca de prompts curados, sincronizada automaticamente a cada 3 dias.

## Categorias (${Object.keys(byCategory).length})

${categoryLinks}

## 🔥 Trending Prompts

${trending || "_Nenhum prompt com score alto ainda._"}

---

\`\`\`dataview
TABLE title AS "Prompt", category AS "Categoria", difficulty AS "Nível", trending_score AS "Score"
FROM "prompts"
WHERE type != "prompts-index"
WHERE trending = true
SORT trending_score DESC
LIMIT 20
\`\`\`
`
  if (writeVaultFile("prompts/_index.md", globalIndex)) written++
  return written
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("→ Fetching skills from Supabase…")
  const skills = await supabaseSelect(
    "trending_skills",
    "id,name,description,category,author,installs,installs_count,tags,icon,external_id,source_url,trending_score",
  )
  console.log(`  ${skills.length} skills found`)

  console.log("→ Fetching prompts from Supabase…")
  const prompts = await supabaseSelect(
    "prompts",
    "id,title,difficulty,color,category,prompt_text,description,example_input,example_output,external_id,source_url,trending_score",
  )
  console.log(`  ${prompts.length} prompts found`)

  console.log("→ Generating skills vault…")
  const skillsWritten = await generateSkillsVault(skills)
  console.log(`  ${skillsWritten} skill files written/updated`)

  console.log("→ Generating prompts vault…")
  const promptsWritten = await generatePromptsVault(prompts)
  console.log(`  ${promptsWritten} prompt files written/updated`)

  const total = skillsWritten + promptsWritten
  console.log(`\n✓ Vault updated: ${total} file(s) changed`)
  // Exit code 2 means "files changed" → GitHub Actions uses this to decide whether to commit
  process.exit(total > 0 ? 2 : 0)
}

main().catch((err) => {
  console.error("generate-vault error:", err)
  process.exit(1)
})
