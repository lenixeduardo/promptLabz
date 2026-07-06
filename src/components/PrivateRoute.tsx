import { Navigate } from "react-router-dom"
import { useAuthContext } from "@/contexts/AuthContext"
import { LoadingScreen } from "@/components/LoadingScreen"

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
