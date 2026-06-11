import { supabase } from "./supabase"

export interface CategoryProgress {
  currentModuleIndex: number
  currentLessonIndex: number
  completedLessonIds: string[]
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  premium_status?: "free" | "trial" | "active" | "cancelled"
  trial_ends_at?: string | null
}

export interface DbResult<T> {
  data: T | null
  error: string | null
}

const profileColumns = "id,email,full_name,avatar_url,premium_status,trial_ends_at"

const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  return !!url && !!key && url !== "your_supabase_url_here"
}

// ── Profile Operations ────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<DbResult<Profile>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .select(profileColumns)
      .eq("id", userId)
      .single()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao carregar perfil") }
  }
}

export async function updateUserProfile(userId: string, fullName: string): Promise<DbResult<Profile>> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase não configurado" }
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ full_name: fullName })
      .eq("id", userId)
      .select(profileColumns)
      .single()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (err) {
    return { data: null, error: getErrorMessage(err, "Erro ao atualizar perfil") }
  }
}

// ── Progress Operations ────────────────────────────────────────────────────────

export async function saveProgress(
  userId: string,
  categoryId: string,
  progress: CategoryProgress
) {
  // Always update local storage
  updateLocalProgress(categoryId, progress)

  if (!isSupabaseConfigured()) return { error: "Supabase não configurado" }

  try {
    const { error } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          category_id: categoryId,
          completed_lessons: progress.completedLessonIds,
          current_module_index: progress.currentModuleIndex,
          current_lesson_index: progress.currentLessonIndex,
        },
        { onConflict: "user_id,category_id" }
      )

    if (error) throw error
    return { error: null }
  } catch (err) {
    return { error: getErrorMessage(err, "Erro ao salvar progresso") }
  }
}

export async function loadProgress(userId: string): Promise<Record<string, CategoryProgress>> {
  // Start with whatever is in local storage
  const localData = getLocalProgress()

  if (!isSupabaseConfigured() || !userId) {
    return localData
  }

  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("category_id,completed_lessons,current_module_index,current_lesson_index")
      .eq("user_id", userId)

    if (error) throw error

    if (data && data.length > 0) {
      const dbProgress: Record<string, CategoryProgress> = { ...localData }
      data.forEach((row) => {
        dbProgress[row.category_id] = {
          currentModuleIndex: row.current_module_index,
          currentLessonIndex: row.current_lesson_index,
          completedLessonIds: row.completed_lessons || [],
        }
      })
      
      // Update local storage to stay in sync
      localStorage.setItem("promptlabz_progress", JSON.stringify(dbProgress))
      return dbProgress
    }
  } catch (err) {
    console.error("Error loading progress from Supabase:", getErrorMessage(err, "Erro ao carregar progresso"))
  }

  return localData
}

// Sync local storage data to database when a user signs in
export async function syncLocalProgressToSupabase(userId: string) {
  if (!isSupabaseConfigured() || !userId) return { error: "Supabase não configurado" }

  try {
    const localData = getLocalProgress()
    const promises = Object.entries(localData).map(([catId, progress]) => {
      return supabase
        .from("user_progress")
        .upsert(
          {
            user_id: userId,
            category_id: catId,
            completed_lessons: progress.completedLessonIds,
            current_module_index: progress.currentModuleIndex,
            current_lesson_index: progress.currentLessonIndex,
          },
          { onConflict: "user_id,category_id" }
        )
    })

    const results = await Promise.all(promises)
    const failed = results.find((result) => result.error)
    if (failed?.error) throw failed.error
    return { error: null }
  } catch (err) {
    return { error: getErrorMessage(err, "Erro ao sincronizar progresso") }
  }
}

// Helper local storage functions
function getLocalProgress(): Record<string, CategoryProgress> {
  try {
    const saved = localStorage.getItem("promptlabz_progress")
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function updateLocalProgress(categoryId: string, progress: CategoryProgress) {
  try {
    const data = getLocalProgress()
    data[categoryId] = progress
    localStorage.setItem("promptlabz_progress", JSON.stringify(data))
  } catch (err) {
    console.error("Error updating local progress storage:", getErrorMessage(err, "Erro ao atualizar storage local"))
  }
}

function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error) return err.message
  if (typeof err === "object" && err && "message" in err) {
    const message = (err as { message?: unknown }).message
    if (typeof message === "string") return message
  }
  return fallback
}
