import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { sileo } from "sileo"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState("Concluindo login com Google...")

  useEffect(() => {
    let active = true

    async function finishOAuth() {
      const url = new URL(window.location.href)
      const code = url.searchParams.get("code")

      if (!code) {
        navigate("/login", { replace: true })
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!active) return

      if (error) {
        sileo.error({ title: error.message || "Erro ao concluir login com Google" })
        navigate("/login", { replace: true })
        return
      }

      localStorage.setItem("promptlabz:hasAccount", "true")
      setMessage("Login concluído. Redirecionando...")
      navigate("/home", { replace: true })
    }

    finishOAuth()

    return () => {
      active = false
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-6">
      <div className="text-center">
        <img
          src="/assets/mascot-login-new.png"
          alt="PromptLabz mascot"
          className="mx-auto mb-4 h-36 w-auto object-contain"
        />
        <p className="text-lg font-medium text-primary-dark">{message}</p>
      </div>
    </div>
  )
}
