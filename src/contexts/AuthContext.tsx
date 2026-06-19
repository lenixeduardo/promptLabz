import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (import.meta.env.VITE_PREVIEW_MODE === 'true') {
    const mockUser = {
      id: 'preview-user', aud: 'authenticated', role: 'authenticated',
      email: 'preview@promptlabz.com', created_at: '', updated_at: '',
      app_metadata: {}, user_metadata: { name: 'Aluno Preview' },
    } as User
    return (
      <AuthContext.Provider value={{ user: mockUser, loading: false, error: null }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session }, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message)
        }
        setUser(session?.user ?? null)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar sessão")
        setUser(null)
      })
      .finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setError(null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook lives beside provider to keep auth API centralized.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
