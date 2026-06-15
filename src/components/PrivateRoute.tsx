import { Navigate } from "react-router-dom"
import { useAuthContext } from "@/contexts/AuthContext"

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end">
        <div className="text-center">
          <img
            src="/assets/mascot-login-new.png"
            alt="Loading"
            className="mx-auto mb-4 h-32 w-auto"
          />
          <p className="text-lg font-medium text-primary-dark">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
