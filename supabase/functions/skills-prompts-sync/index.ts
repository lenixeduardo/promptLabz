import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const syncSecret = Deno.env.get("SKILLS_SYNC_SECRET")!
const githubToken = Deno.env.get("GITHUB_TOKEN") ?? ""

// ── Category mappings ────────────────────────────────────────────────────────

const SKILL_CATEGORY_MAP: Record<string, string> = {
  productivity:      "Produtividade",
  development:       "Desenvolvimento",
  design:            "Design & UI",
  marketing:         "Marketing",
  "ai-media":        "IA & Media",
  cloud:             "Cloud & Infra",
  "agent-workflows": "Agentes & Workflows",
}

const PROMPT_CATEGORIES = [
  "Criatividade", "Marketing", "Programacao",
  "Educacao", "Produtividade", "Gestao de Produto",
]

const PROMPT_KEYWORDS: Record<string, string[]> = {
  Criatividade:       ["creative", "story", "fiction", "design", "art", "brainstorm", "criativ", "história"],
  Marketing:          ["marketing", "copywriting", "ads", "campaign", "social media", "seo", "brand"],
  Programacao:        ["code", "programm", "developer", "debug", "refactor", "api", "sql", "typescript"],
  Educacao:           ["teach", "learn", "explain", "educati", "tutorial", "student", "course"],
  Produtividade:      ["productive", "task", "schedule", "plan", "summary", "email", "meeting", "produtiv"],
  "Gestao de Produto": ["product", "roadmap", "feature", "user story", "sprint", "backlog", "prd"],
}

// ── GitHub helpers ───────────────────────────────────────────────────────────

const GH_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "promptlabz-skills-sync",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
}

async function ghFetch(url: string) {
  const res = await fetch(url, { headers: GH_HEADERS })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`)
  return res.json()
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return {}
  const result: Record<string, string> = {}
  for (const line of match[1].split("\n")) {
    const [k, ...rest] = line.split(":")
    if (k && rest.length) result[k.trim()] = rest.join(":").trim()
  }
  return result
}

// Compute trending score from GitHub stats (0–100 scale)
function trendingScore(stars: number, forks: number, pushedDaysAgo: number): number {
  const recency = Math.max(0, 100 - pushedDaysAgo * 0.3)
  const popularity = Math.min(100, Math.log10(stars + forks + 1) * 30)
  return Math.round(popularity * 0.6 + recency * 0.4)
}

// ── Skills fetch ─────────────────────────────────────────────────────────────

interface SkillRow {
  name: string
  description: string
  category: string
  author: string
  installs: string
  installs_count: number
  tags: string[]
  icon: string
  sort_order: number
  external_id: string
  source_url: string
  trending_score: number
  last_synced_at: string
}

const CATEGORY_ICONS: Record<string, string> = {
  "Produtividade":      "⚡",
  "Desenvolvimento":    "💻",
  "Design & UI":        "🎨",
  "Marketing":          "📣",
  "IA & Media":         "🤖",
  "Cloud & Infra":      "☁️",
  "Agentes & Workflows":"🔄",
}

async function fetchSkillsFromGitHub(): Promise<SkillRow[]> {
  // Search GitHub for repositories containing SKILL.md
  const searchUrl =
    "https://api.github.com/search/code?q=filename:SKILL.md+path:/&sort=indexed&order=desc&per_page=50"

  let items: { repository: { full_name: string; stargazers_count: number; forks_count: number; pushed_at: string; html_url: string }; html_url: string }[] = []
  try {
    const result = await ghFetch(searchUrl)
    items = result.items ?? []
  } catch {
    return []
  }

  const skills: SkillRow[] = []
  const seen = new Set<string>()
  const now = Date.now()

  for (const item of items) {
    const repo = item.repository
    if (!repo) continue

    const [owner, repoName] = repo.full_name.split("/")
    const externalId = `gh_${owner}_${repoName}`
    if (seen.has(externalId)) continue
    seen.add(externalId)

    // Fetch the SKILL.md content
    let frontmatter: Record<string, string> = {}
    try {
      const rawUrl = `https://raw.githubusercontent.com/${repo.full_name}/HEAD/SKILL.md`
      const text = await fetch(rawUrl).then((r) => (r.ok ? r.text() : ""))
      frontmatter = parseFrontmatter(text)
    } catch {
      continue
    }

    const rawCategory = (frontmatter.category ?? "").toLowerCase().trim()
    const ptCategory = SKILL_CATEGORY_MAP[rawCategory]
    if (!ptCategory) continue // skip skills not matching our categories

    const pushedDaysAgo = (now - new Date(repo.pushed_at).getTime()) / 864e5
    const score = trendingScore(repo.stargazers_count, repo.forks_count, pushedDaysAgo)
    const installs = repo.stargazers_count
    const installs_str =
      installs >= 1000 ? `${Math.round(installs / 1000)}K` : String(installs)

    skills.push({
      name: frontmatter.name || repoName,
      description: frontmatter.description || `Skill from ${owner}`,
      category: ptCategory,
      author: frontmatter.author || owner,
      installs: installs_str,
      installs_count: installs,
      tags: (frontmatter.tags ?? "")
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      icon: CATEGORY_ICONS[ptCategory] ?? "🔧",
      sort_order: 9999,
      external_id: externalId,
      source_url: repo.html_url,
      trending_score: score,
      last_synced_at: new Date().toISOString(),
    })
  }

  return skills.sort((a, b) => b.trending_score - a.trending_score)
}

// ── Prompts fetch ────────────────────────────────────────────────────────────

interface PromptRow {
  title: string
  difficulty: string
  color: string
  category: string
  prompt_text: string
  description: string
  example_input: string | null
  example_output: string | null
  sort_order: number
  external_id: string
  source_url: string
  trending_score: number
  last_synced_at: string
}

const PROMPT_SOURCES = [
  "f/awesome-chatgpt-prompts",
  "ai-boost/awesome-prompts",
  "PlexPt/awesome-chatgpt-prompts-zh",
  "yokoffing/ChatGPT-Prompts",
  "linexjlin/GPTs",
]

function categorizePrompt(text: string): string {
  const lower = text.toLowerCase()
  let best = "Criatividade"
  let bestScore = 0
  for (const [cat, keywords] of Object.entries(PROMPT_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length
    if (score > bestScore) {
      bestScore = score
      best = cat
    }
  }
  return best
}

function difficultyFromLength(text: string): { difficulty: string; color: string } {
  const len = text.length
  if (len < 300) return { difficulty: "Iniciante", color: "green" }
  if (len < 800) return { difficulty: "Intermediario", color: "yellow" }
  return { difficulty: "Avancado", color: "red" }
}

// Parse GitHub awesome-prompts CSV/markdown format
function parsePromptRows(csvOrMd: string, repoFullName: string, stars: number): PromptRow[] {
  const rows: PromptRow[] = []
  const now = new Date().toISOString()
  const lines = csvOrMd.split("\n")
  const seen = new Set<string>()

  // CSV format: act,prompt
  if (lines[0]?.toLowerCase().includes("act,prompt")) {
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      // Handle quoted CSV
      const match = line.match(/^"?([^",]+)"?,\s*"([\s\S]+)"/)
      if (!match) continue
      const title = match[1].trim().slice(0, 200)
      const promptText = match[2].replace(/""/g, '"').trim()
      if (!promptText || promptText.length < 20) continue

      const key = title.toLowerCase().replace(/\s+/g, "-")
      if (seen.has(key)) continue
      seen.add(key)

      const category = categorizePrompt(`${title} ${promptText}`)
      const { difficulty, color } = difficultyFromLength(promptText)

      rows.push({
        title,
        difficulty,
        color,
        category,
        prompt_text: promptText.slice(0, 2000),
        description: `${title} — importado de ${repoFullName}`,
        example_input: null,
        example_output: null,
        sort_order: 9999,
        external_id: `gh_${repoFullName.replace("/", "_")}_${key}`.slice(0, 150),
        source_url: `https://github.com/${repoFullName}`,
        trending_score: Math.min(100, Math.round(Math.log10(stars + 1) * 33)),
        last_synced_at: now,
      })
    }
  }

  return rows.slice(0, 20)
}

async function fetchPromptsFromGitHub(): Promise<PromptRow[]> {
  const all: PromptRow[] = []

  for (const repoFullName of PROMPT_SOURCES) {
    let repoMeta: { stargazers_count: number; default_branch: string } | null = null
    try {
      repoMeta = await ghFetch(`https://api.github.com/repos/${repoFullName}`)
    } catch {
      continue
    }

    // Try prompts.csv then README.md
    for (const filename of ["prompts.csv", "README.md"]) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${repoFullName}/${repoMeta.default_branch}/${filename}`
        const text = await fetch(rawUrl).then((r) => (r.ok ? r.text() : ""))
        if (!text) continue
        const rows = parsePromptRows(text, repoFullName, repoMeta.stargazers_count)
        all.push(...rows)
        if (rows.length > 0) break
      } catch {
        continue
      }
    }
  }

  return all.sort((a, b) => b.trending_score - a.trending_score)
}

// ── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  const authHeader = req.headers.get("Authorization")
  if (!syncSecret || authHeader !== `Bearer ${syncSecret}`) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const now = new Date().toISOString()

    const [newSkills, newPrompts] = await Promise.all([
      fetchSkillsFromGitHub(),
      fetchPromptsFromGitHub(),
    ])

    let skillsInserted = 0
    let promptsInserted = 0

    // ── Upsert skills ──────────────────────────────────────────────────────
    if (newSkills.length > 0) {
      const externalIds = newSkills.map((s) => s.external_id)
      const { data: existing } = await supabase
        .from("trending_skills")
        .select("external_id")
        .in("external_id", externalIds)

      const existingSet = new Set((existing ?? []).map((r) => r.external_id as string))
      const toInsert = newSkills.filter((s) => !existingSet.has(s.external_id))

      if (toInsert.length > 0) {
        const { error } = await supabase.from("trending_skills").insert(toInsert)
        if (error) console.error("skills insert error:", error)
        else skillsInserted = toInsert.length
      }

      // Update trending_score for existing items
      const toUpdate = newSkills.filter((s) => existingSet.has(s.external_id))
      for (const skill of toUpdate) {
        await supabase
          .from("trending_skills")
          .update({ trending_score: skill.trending_score, last_synced_at: now })
          .eq("external_id", skill.external_id)
      }
    }

    // ── Upsert prompts ─────────────────────────────────────────────────────
    if (newPrompts.length > 0) {
      const externalIds = newPrompts.map((p) => p.external_id)
      const { data: existing } = await supabase
        .from("prompts")
        .select("external_id")
        .in("external_id", externalIds)

      const existingSet = new Set((existing ?? []).map((r) => r.external_id as string))
      const toInsert = newPrompts.filter((p) => !existingSet.has(p.external_id))

      if (toInsert.length > 0) {
        const { error } = await supabase.from("prompts").insert(toInsert)
        if (error) console.error("prompts insert error:", error)
        else promptsInserted = toInsert.length
      }
    }

    console.log(`skills-prompts-sync: ${skillsInserted} skills, ${promptsInserted} prompts inserted`)

    return new Response(
      JSON.stringify({
        ok: true,
        skills: { found: newSkills.length, inserted: skillsInserted },
        prompts: { found: newPrompts.length, inserted: promptsInserted },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    console.error("skills-prompts-sync error:", err)
    return new Response(
      JSON.stringify({ error: "internal_error", message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
})
