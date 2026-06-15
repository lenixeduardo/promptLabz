# Graph Report - .  (2026-06-13)

## Corpus Check
- 255 files · ~325,727 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 717 nodes · 1138 edges · 51 communities (43 shown, 8 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 188 edges (avg confidence: 0.83)
- Token cost: 26,800 input · 6,150 output

## Community Hubs (Navigation)
- [[_COMMUNITY_React UI Components|React UI Components]]
- [[_COMMUNITY_AI Media & Cloud Skills|AI Media & Cloud Skills]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Auth Guard & Route Protection|Auth Guard & Route Protection]]
- [[_COMMUNITY_Project Docs & Architecture|Project Docs & Architecture]]
- [[_COMMUNITY_Lives System & Config|Lives System & Config]]
- [[_COMMUNITY_Avatar System & Rarities|Avatar System & Rarities]]
- [[_COMMUNITY_TypeScript App Config|TypeScript App Config]]
- [[_COMMUNITY_Error Boundary & Resilience|Error Boundary & Resilience]]
- [[_COMMUNITY_UI Brainstorm Prototypes|UI Brainstorm Prototypes]]
- [[_COMMUNITY_Achievements Context|Achievements Context]]
- [[_COMMUNITY_Skills & Trending Data|Skills & Trending Data]]
- [[_COMMUNITY_Dev Dependencies & Tooling|Dev Dependencies & Tooling]]
- [[_COMMUNITY_shadcn Component Aliases|shadcn Component Aliases]]
- [[_COMMUNITY_TypeScript Node Config|TypeScript Node Config]]
- [[_COMMUNITY_Mascot Illustrations|Mascot Illustrations]]
- [[_COMMUNITY_Lessons & Content Data|Lessons & Content Data]]
- [[_COMMUNITY_Build Scripts & Commands|Build Scripts & Commands]]
- [[_COMMUNITY_Marketing Skills|Marketing Skills]]
- [[_COMMUNITY_Mascot Achievement Icons|Mascot Achievement Icons]]
- [[_COMMUNITY_Auth Email Edge Function|Auth Email Edge Function]]
- [[_COMMUNITY_Dev Process Skills|Dev Process Skills]]
- [[_COMMUNITY_Implementation Summaries|Implementation Summaries]]
- [[_COMMUNITY_Design & Brand Skills|Design & Brand Skills]]
- [[_COMMUNITY_Supabase Functions & Migrations|Supabase Functions & Migrations]]
- [[_COMMUNITY_Image Processing Scripts|Image Processing Scripts]]
- [[_COMMUNITY_Mascot Gamification Icons|Mascot Gamification Icons]]
- [[_COMMUNITY_Lint & Smoke Test Config|Lint & Smoke Test Config]]
- [[_COMMUNITY_TypeScript Path Aliases|TypeScript Path Aliases]]
- [[_COMMUNITY_App Wireframes & Avatars|App Wireframes & Avatars]]
- [[_COMMUNITY_Claude Code Hooks & Settings|Claude Code Hooks & Settings]]
- [[_COMMUNITY_Dev Workflow Skills|Dev Workflow Skills]]
- [[_COMMUNITY_Database Schema & RLS|Database Schema & RLS]]
- [[_COMMUNITY_TypeScript Config Root|TypeScript Config Root]]
- [[_COMMUNITY_Mascot Icon Showcase|Mascot Icon Showcase]]
- [[_COMMUNITY_Stripe Checkout & CORS|Stripe Checkout & CORS]]
- [[_COMMUNITY_Azure Cloud Skills|Azure Cloud Skills]]
- [[_COMMUNITY_Prompt Templates Data|Prompt Templates Data]]
- [[_COMMUNITY_Lark Suite Skills|Lark Suite Skills]]
- [[_COMMUNITY_Productivity Planning Skills|Productivity Planning Skills]]
- [[_COMMUNITY_Deployment Skills|Deployment Skills]]
- [[_COMMUNITY_Document Processing Skills|Document Processing Skills]]
- [[_COMMUNITY_Browser Agent Skills|Browser Agent Skills]]
- [[_COMMUNITY_Code Quality Skills|Code Quality Skills]]
- [[_COMMUNITY_Writing Style Skills|Writing Style Skills]]
- [[_COMMUNITY_Analytics Mascot Icons|Analytics Mascot Icons]]
- [[_COMMUNITY_MCP & Lab Skills|MCP & Lab Skills]]
- [[_COMMUNITY_DOCX Skill|DOCX Skill]]
- [[_COMMUNITY_Signup Test Suite|Signup Test Suite]]
- [[_COMMUNITY_Skills Lock Config|Skills Lock Config]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 26 edges
2. `useAuth()` - 24 edges
3. `cn()` - 20 edges
4. `PromptLabz README` - 19 edges
5. `AchievementsProvider()` - 17 edges
6. `useAchievements()` - 16 edges
7. `compilerOptions` - 16 edges
8. `supabase` - 15 edges
9. `scripts` - 14 edges
10. `useAuthContext()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Signup()` --shares_data_with--> `send-auth-email Edge Function`  [INFERRED]
  src/pages/Signup.tsx → supabase/functions/send-auth-email/index.ts
- `Email Confirmation Preview` --conceptually_related_to--> `PromptLabz App Entry Point (index.html)`  [INFERRED]
  docs/email-confirmation-preview.png → index.html
- `Parallel Agent Code Review Pattern` --semantically_similar_to--> `Dispatching Parallel Agents Skill`  [INFERRED] [semantically similar]
  AGENTS_CODE_REVIEW_REPORT.md → skills/agent-workflows/dispatching-parallel-agents/SKILL.md
- `Verification Before Completion Skill` --semantically_similar_to--> `Project Quality Checklist (11 areas)`  [INFERRED] [semantically similar]
  skills/agent-workflows/verification-before-completion/SKILL.md → CLAUDE.md
- `Home Validation - Inter Font Test` --semantically_similar_to--> `PromptLabz Homepage with Inter Font`  [INFERRED] [semantically similar]
  home-validation.html → homepage-with-inter.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Mascot Learning/Knowledge Icons** — mascot_icons_mascot_book, mascot_icons_mascot_brain, mascot_icons_mascot_graduation, mascot_icons_mascot_lightbulb [INFERRED 0.95]
- **Mascot Achievement/Recognition Icons** — mascot_icons_mascot_celebrate, mascot_icons_mascot_crown, mascot_icons_mascot_medal [INFERRED 0.95]
- **Mascot Productivity/Work Icons** — mascot_icons_mascot_code, mascot_icons_mascot_focus, mascot_icons_mascot_chart, mascot_icons_mascot_network [INFERRED 0.85]
- **Mascot Emotional/Expressive Icons** — mascot_icons_mascot_heart, mascot_icons_mascot_growth, mascot_icons_mascot_palette [INFERRED 0.75]
- **All Mascot SVG Icons - Shared Green Character Design** — mascot_icons_mascot_book, mascot_icons_mascot_brain, mascot_icons_mascot_celebrate, mascot_icons_mascot_chart, mascot_icons_mascot_code, mascot_icons_mascot_crown, mascot_icons_mascot_focus, mascot_icons_mascot_graduation, mascot_icons_mascot_growth, mascot_icons_mascot_heart, mascot_icons_mascot_lightbulb, mascot_icons_mascot_medal, mascot_icons_mascot_network, mascot_icons_mascot_palette [EXTRACTED 1.00]
- **PromptLabz UI Screens Collection** —  [INFERRED 0.95]
- **Agent Workflow Skills Collection** — browsing_skill, dispatching_parallel_agents_skill, mcp_cli_skill, receiving_code_review_skill, requesting_code_review_skill, subagent_driven_development_skill, verification_before_completion_skill, writing_clearly_concisely_skill [EXTRACTED 1.00]
- **Grill Me Skill Copies Across Skill Dirs** — agents_skill_grill_me, claude_skill_grill_me, cortex_skill_grill_me [EXTRACTED 1.00]
- **PromptLabz Project Documentation** — agents_md, agents_code_review_report, architecture_md, auth_todo_md, backend_todo_md, claude_md, code_review_guidelines, contributing_md [INFERRED 0.95]
- **obra Superpowers GitHub Sources** — superpowers_source, superpowers_chrome_source, superpowers_lab_source, elements_of_style_source [EXTRACTED 1.00]
- **Authentication Flow** — lib_supabase_supabase, contexts_authcontext_authprovider, contexts_authcontext_useauthcontext, hooks_useauth_useauth [INFERRED 0.95]
- **Achievements System Data Flow** — lib_achievements_checkachievements, lib_achievements_loadachievements, lib_achievements_saveachievements, lib_achievements_updatestreak, contexts_achievementscontext_achievementsprovider, hooks_useachievements_useachievements, lib_db_loadstreak, lib_db_savestreak [INFERRED 0.95]
- **Lives System Data Flow** — contexts_livescontext_livesprovider, contexts_livesstate_livescontext, contexts_livesstate_livesctx, contexts_lives_config_max_lives, contexts_lives_config_recharge_ms, contexts_uselives_uselives [INFERRED 0.95]
- **Progress Persistence Flow (localStorage + Supabase)** — lib_db_saveprogress, lib_db_loadprogress, lib_db_synclocalprogress, lib_db_categoryprogress, lib_supabase_supabase [INFERRED 0.90]
- **Provider Nesting Pattern (App Root)** — src_app_app, contexts_authcontext_authprovider, contexts_livescontext_livesprovider, contexts_achievementscontext_achievementsprovider [EXTRACTED 1.00]
- **Authentication Pages Flow** — pages_hero_hero, pages_login_login, pages_authcallback_authcallback, pages_forgotpassword_forgotpassword, pages_resetpassword_resetpassword [INFERRED 0.95]
- **Lesson Learning Flow** — pages_learninglab_learninglab, pages_lesson_lesson, pages_missioncomplete_missioncomplete [INFERRED 0.95]
- **Profile and Achievement User Flow** — pages_home_home, pages_profile_profile, pages_achievements_achievements, pages_avatarscreen_avatarscreen [INFERRED 0.90]
- **Password Recovery Flow** — pages_login_login, pages_forgotpassword_forgotpassword, pages_resetpassword_resetpassword [INFERRED 0.95]
- **Authentication Subsystem** —  [INFERRED]
- **Premium/Subscription Subsystem** —  [INFERRED]
- **Skills Browser Subsystem** —  [INFERRED]
- **User Gamification Subsystem** —  [INFERRED]

## Communities (51 total, 8 thin omitted)

### Community 0 - "React UI Components"
Cohesion: 0.06
Nodes (51): BrandLogo(), BrandLogoProps, CircleRevealEntry(), CircleTransition(), CircleTransitionProps, CroppedImage(), CroppedImageProps, HelpButton() (+43 more)

### Community 1 - "AI Media & Cloud Skills"
Cohesion: 0.06
Nodes (50): Skill: AI Avatar Video, Skill: AI Image Generation, Skill: AI Music Generation, Skill: AI Video Generation, Skill: Azure Cloud Migration, Skill: Azure Compute, Skill: ControlNet Pose, Community Premium Design Spec (+42 more)

### Community 2 - "Runtime Dependencies"
Cohesion: 0.04
Nodes (45): dependencies, class-variance-authority, clsx, lucide-react, @radix-ui/react-accordion, @radix-ui/react-alert-dialog, @radix-ui/react-aspect-ratio, @radix-ui/react-avatar (+37 more)

### Community 3 - "Auth Guard & Route Protection"
Cohesion: 0.08
Nodes (28): PrivateRoute(), PrivateRouteProps, mockUseAuthContext, PrivateRoute Tests, renderWithRouter(), AuthContext, AuthContextType, AuthProvider() (+20 more)

### Community 4 - "Project Docs & Architecture"
Cohesion: 0.08
Nodes (35): AGENTS Code Review Report (PR #17), AGENTS.md — Quality Checklist, Grill Me Skill (agents), ARCHITECTURE.md — System Architecture, AuthContext (global session state), AUTH_TODO.md — Authentication Roadmap, BACKEND_TODO.md — Backend Audit, CI Validate Job (typecheck+lint+test+build) (+27 more)

### Community 5 - "Lives System & Config"
Cohesion: 0.11
Nodes (18): LivesBar(), LivesBarProps, MAX_LIVES Constant, RECHARGE_MS Constant, LivesProvider(), Stored, LivesContext, LivesCtx (+10 more)

### Community 6 - "Avatar System & Rarities"
Cohesion: 0.17
Nodes (21): Avatar, AVATARS, getAvatarById(), CategoryProgress, DbResult, getErrorMessage(), getLocalProgress(), getProgressStorageKey() (+13 more)

### Community 7 - "TypeScript App Config"
Cohesion: 0.07
Nodes (27): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+19 more)

### Community 8 - "Error Boundary & Resilience"
Cohesion: 0.08
Nodes (15): ErrorBoundary, Props, State, ErrorBoundary Tests, mockError, mockExchangeCodeForSession, renderCallback(), mockResetPassword (+7 more)

### Community 9 - "UI Brainstorm Prototypes"
Cohesion: 0.09
Nodes (24): Promo Free Month Banner, Prompita Onboarding Chat UI v2, Prompita Onboarding Chat UI v3, Prompita Onboarding Chat UI v4, Prompita Onboarding Chat UI v5, Prompita Onboarding Chat UI v6, Prompita First Access Placement Options, Desktop Scroll Approach for Module/Track Selector (+16 more)

### Community 10 - "Achievements Context"
Cohesion: 0.21
Nodes (19): AchievementsProvider(), AchievementsContext, AchievementsCtx, Achievement, ACHIEVEMENTS, ACHIEVEMENTS_MAP, AchievementsData, checkAchievements() (+11 more)

### Community 11 - "Skills & Trending Data"
Cohesion: 0.11
Nodes (13): SkillCategory, TRENDING_SKILLS, TrendingSkill, TrendingSkillsData, useFavorites Test Suite, useFavorites(), SkillDetail(), SKILL_CATEGORIES (+5 more)

### Community 12 - "Dev Dependencies & Tooling"
Cohesion: 0.08
Nodes (24): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+16 more)

### Community 13 - "shadcn Component Aliases"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 14 - "TypeScript Node Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+8 more)

### Community 15 - "Mascot Illustrations"
Cohesion: 0.27
Nodes (14): Mascot Coding Illustration, Mascot Creativity Illustration, Mascot Home Illustration, Mascot Learn Illustration, Mascot Learn New Illustration, Mascot Login Illustration, Mascot Login New Illustration, Mascot Promo Illustration (+6 more)

### Community 16 - "Lessons & Content Data"
Cohesion: 0.21
Nodes (10): Category, ContentBlock, Lesson, lessonsData, Module, Question, QuestionOption, ContentViewProps (+2 more)

### Community 17 - "Build Scripts & Commands"
Cohesion: 0.14
Nodes (14): scripts, build, build:prod, check, clean, dev, install-deps, lint (+6 more)

### Community 18 - "Marketing Skills"
Cohesion: 0.24
Nodes (13): AI SEO Skill, Community Marketing Skill, Content Strategy Skill, Copywriting Skill, Conversion Rate Optimisation (CRO) Skill, Product Launch Skill, Marketing Psychology Skill, Pricing Strategy Skill (+5 more)

### Community 19 - "Mascot Achievement Icons"
Cohesion: 0.18
Nodes (12): Mascot Book Icon, Mascot Brain Icon, Mascot Celebrate Icon, Mascot Code Icon, Mascot Crown Icon, Mascot Focus Icon, Mascot Graduation Icon, Mascot Heart Icon (+4 more)

### Community 20 - "Auth Email Edge Function"
Cohesion: 0.21
Nodes (9): appUrl, buildEmailHtml(), EmailActionType, escapeHtml(), getActionCopy(), getRecipientName(), HookPayload, hookSecret (+1 more)

### Community 21 - "Dev Process Skills"
Cohesion: 0.18
Nodes (11): A/B Testing, Improve Codebase Architecture, MCP Builder, Next.js Best Practices, Next.js Upgrade, Prototype, Skill Creator, Supabase + PostgreSQL Best Practices (+3 more)

### Community 22 - "Implementation Summaries"
Cohesion: 0.22
Nodes (11): Inter Font Application Summary, Tailwind Config (font: Inter), Achievements Page (src/pages/Achievements.tsx), Home Page (src/pages/Home.tsx), PromptLabz Implementation Summary, MascotIconShowcase Component, Mascot Icons Guide, SVG Mascot Icon Assets (21 icons) (+3 more)

### Community 23 - "Design & Brand Skills"
Cohesion: 0.29
Nodes (10): Brand Guidelines Skill, Brand Kit Skill, Design Taste Frontend Skill, Frontend Design Skill, High-End Visual Design Skill, Image to Code Skill, Industrial Brutalist UI Skill, Redesign Skill (+2 more)

### Community 24 - "Supabase Functions & Migrations"
Cohesion: 0.22
Nodes (10): send-auth-email Edge Function, CORS Headers Shared Config, stripe-checkout Edge Function, DB Table: user_progress, DB Table: users, DB Migration: users premium columns, DB Table: daily_tips, DB Table: news (+2 more)

### Community 25 - "Image Processing Scripts"
Cohesion: 0.29
Nodes (9): crop_and_save(), detect_bg_colors(), flood_fill_bg_mask(), main(), Crop a region from src_path, remove background, save as transparent PNG.     bg_, Build a background mask by flood-filling from all border pixels     whose color, Remove background using multi-seed flood fill.     bg_colors: list of RGB tuples, Detect distinct background colors from image corners.     Returns list of unique (+1 more)

### Community 26 - "Mascot Gamification Icons"
Cohesion: 0.61
Nodes (8): Inter Font Demo SVG, Mascot Puzzle Icon, Mascot Quest Icon, Mascot Rocket Icon, Mascot Star Icon, Mascot Target Icon, Mascot Team Icon, Mascot Trophy Icon

### Community 27 - "Lint & Smoke Test Config"
Cohesion: 0.33
Nodes (4): Package JSON, missing, Test Setup File, Supabase Environment Variables

### Community 28 - "TypeScript Path Aliases"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, files, @/*, references

### Community 29 - "App Wireframes & Avatars"
Cohesion: 0.53
Nodes (6): Cat Avatar / User Profile Icon, Help Cat Widget Icon, Home Screen Wireframe, Learning Lab / Lesson List Screen Wireframe, Login Screen Wireframe, Skills / Prompt Library Screen Wireframe

### Community 30 - "Claude Code Hooks & Settings"
Cohesion: 0.40
Nodes (4): Claude Settings, git-guardrails.sh script, session-start.sh script, block()

### Community 31 - "Dev Workflow Skills"
Cohesion: 0.33
Nodes (6): GitHub Actions & CI/CD, Test-Driven Development (TDD), To Issues, To PRD, Triage, Web App Testing

### Community 32 - "Database Schema & RLS"
Cohesion: 0.40
Nodes (6): Premium Status / Subscription Model, Supabase Database Schema, Row Level Security (RLS), User Progress Table, Users Table, Stripe Integration

### Community 33 - "TypeScript Config Root"
Cohesion: 0.33
Nodes (4): exclude, include, TypeScript Root Config, include

### Community 34 - "Mascot Icon Showcase"
Cohesion: 0.40
Nodes (3): CATEGORIES, MASCOT_ICONS, MascotIcon

### Community 35 - "Stripe Checkout & CORS"
Cohesion: 0.50
Nodes (3): corsHeaders, stripe, supabaseAdmin

### Community 36 - "Azure Cloud Skills"
Cohesion: 0.83
Nodes (4): Azure Cost Optimization Skill, Azure Kubernetes Skill, Azure Security Skill, OpenClaw Secure Linux Cloud Skill

### Community 37 - "Prompt Templates Data"
Cohesion: 0.50
Nodes (3): PromptCard, PROMPTS, PromptsData

### Community 38 - "Lark Suite Skills"
Cohesion: 0.83
Nodes (4): Lark Approval Skill, Lark Attendance Skill, Lark Base Skill, Lark Doc Skill

### Community 39 - "Productivity Planning Skills"
Cohesion: 0.67
Nodes (3): Brainstorming Skill, Executing Plans Skill, Handoff Skill

### Community 40 - "Deployment Skills"
Cohesion: 1.00
Nodes (3): Deploy to Vercel Skill, Find Skills Skill, Firebase Basics Skill

### Community 41 - "Document Processing Skills"
Cohesion: 1.00
Nodes (3): PDF Processing, PowerPoint (PPTX) Processing, Excel (XLSX) Processing

## Knowledge Gaps
- **295 isolated node(s):** `session-start.sh script`, `$schema`, `style`, `rsc`, `tsx` (+290 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Package JSON` connect `Lint & Smoke Test Config` to `Error Boundary & Resilience`, `Image Processing Scripts`, `Claude Code Hooks & Settings`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `React UI Components` to `Lessons & Content Data`, `Auth Guard & Route Protection`, `Avatar System & Rarities`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `TypeScript App Config` to `TypeScript Config Root`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `session-start.sh script`, `$schema`, `style` to the rest of the system?**
  _301 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.060759493670886074 - nodes in this community are weakly interconnected._
- **Should `AI Media & Cloud Skills` be split into smaller, more focused modules?**
  _Cohesion score 0.05877551020408163 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._