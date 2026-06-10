import { supabase } from "@/lib/supabase"
import { useAuthContext } from "@/contexts/AuthContext"

export function useAuth() {
  const { user, loading, error } = useAuthContext()

  const login = async (email: string, password: string) => {
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) throw err
      return { success: true, user: data.user }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao fazer login"
      return { success: false, error: errorMsg }
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })
      if (err) throw err
      const needsConfirmation = !data.session
      return { success: true, user: data.user, needsConfirmation }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao criar conta"
      return { success: false, error: errorMsg, needsConfirmation: false }
    }
  }

  const logout = async () => {
    try {
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
      return { success: true }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao fazer logout"
      return { success: false, error: errorMsg }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      })
      if (err) throw err
      return { success: true }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao enviar email de reset"
      return { success: false, error: errorMsg }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
      })
      if (err) throw err
      return { success: true, user: null }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao fazer login com Google"
      return { success: false, error: errorMsg }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { data, error: err } = await supabase.auth.updateUser({
        password,
      })
      if (err) throw err
      return { success: true, user: data.user }
    } catch (err: any) {
      const errorMsg = err?.message || "Erro ao atualizar senha"
      return { success: false, error: errorMsg }
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle,
    updatePassword,
  }
}
