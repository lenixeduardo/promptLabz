import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Lock, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleRevealEntry } from "@/components/CircleTransition"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { trackLogin } from "@/lib/analytics"
import { PageSEO } from "@/components/PageSEO"
import { errorLogger } from "@/lib/errorLogging"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.463 2.213-1.19 2.982-.79.85-2.07 1.5-3.09 1.42-.14-1.1.43-2.25 1.14-2.98.79-.83 2.16-1.44 3.14-1.42ZM20.34 17.4c-.55 1.27-.82 1.83-1.53 2.95-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.94-1.01-4.03-1-2.09.01-2.53 1.02-4.07 1-1.73-.02-3.05-1.77-4.04-3.33-2.77-4.33-3.06-9.41-1.35-12.11 1.21-1.92 3.13-3.05 4.93-3.05 1.84 0 3 .99 4.53.99 1.48 0 2.38-1 4.53-1 1.6 0 3.29.87 4.5 2.38-3.96 2.17-3.32 7.83.65 9.66Z" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [user, navigate])

  useEffect(() => {
    if (rateLimitCooldown > 0) {
      const timer = setTimeout(() => setRateLimitCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [rateLimitCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rateLimitCooldown > 0) {
      errorLogger.logRateLimit("/auth/login", rateLimitCooldown)
      sileo.error({
        title: `Aguarde ${rateLimitCooldown}s`,
        description: "Você tentou fazer login muitas vezes. Por favor, tente novamente em alguns segundos."
      })
      return
    }

    setLoading(true)
    setRateLimitCooldown(3)

    const result = await login(email, password)
    if (result.success) {
      errorLogger.logAuthEvent("login", user?.id || "unknown", true)
      trackLogin("email")
      sileo.success({ title: "Login realizado com sucesso!" })
      navigate("/home")
    } else {
      errorLogger.logAuthEvent("login", email, false)
      sileo.error({ title: result.error || "Erro ao fazer login" })
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    if (rateLimitCooldown > 0) {
      errorLogger.logRateLimit("/auth/google", rateLimitCooldown)
      sileo.error({
        title: `Aguarde ${rateLimitCooldown}s`,
        description: "Você tentou fazer login muitas vezes. Por favor, tente novamente em alguns segundos."
      })
      return
    }

    setLoading(true)
    setRateLimitCooldown(3)

    const result = await loginWithGoogle()
    if (result.success) {
      errorLogger.logAuthEvent("login", user?.id || "unknown", true)
      trackLogin("google")
      sileo.success({ title: "Login com Google realizado!" })
      navigate("/home")
    } else {
      errorLogger.logAuthEvent("login", "google-user", false)
      sileo.error({ title: result.error || "Erro ao fazer login com Google" })
    }
    setLoading(false)
  }

  // Classe "dark" fixa: esta tela usa sempre a paleta escura (fundo preto),
  // independente do tema do app — evita texto claro sobre fundo branco
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-gradient-to-b from-pageBgLight via-gradient-mid to-gradient-end px-5 py-8 text-foreground">
      <PageSEO
        title="Entrar no PromptLabz — Aprenda IA com Gamificacao"
        description="Acesse sua conta PromptLabz e retome seu progresso. Trilha gamificada de engenharia de prompts com sistema de vidas, XP e conquistas. Continue agora."
        canonicalPath="/login"
      />
      {/* Shrinking circle reveal â€" plays when arriving from Hero */}
      <CircleRevealEntry />
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
        {/* Mascot + wordmark + tagline hero art (all baked into the asset) */}
        <img
          src="/assets/mascot-login-hero.png"
          alt="PromptLabz — Aprenda. Crie. Evolua."
          className="w-[280px] max-w-full object-contain"
        />

        {/* Heading */}
        <h1 className="mt-6 text-center text-2xl font-extrabold leading-tight text-foreground sm:text-[28px]">
          Seja bem-vindo! 👋
        </h1>
        <p className="mt-2 text-center text-sm text-foregroundTertiary">
          Entre para continuar sua jornada criativa
        </p>

        <div className="mt-7 w-full">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} role="form" aria-label="Formulário de login">
            <Input
              type="text"
              placeholder="E-mail ou nome de usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<User className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="email"
              required
              disabled={loading}
              aria-label="E-mail ou nome de usuário para login"
              aria-required="true"
              aria-describedby="email-help-login"
            />
            <small id="email-help-login" className="sr-only">
              Insira o e-mail da sua conta
            </small>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex h-7 w-7 items-center justify-center text-foregroundTertiary hover:text-primary"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
              autoComplete="current-password"
              required
              disabled={loading}
              aria-label="Sua senha de acesso"
              aria-required="true"
              aria-describedby="password-help-login"
            />
            <small id="password-help-login" className="sr-only">
              Insira sua senha de acesso segura
            </small>

            <Link
              to="/forgot-password"
              className="-mt-1 self-end text-sm font-medium text-link underline underline-offset-2 hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>

            <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={loading || rateLimitCooldown > 0}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Entrando..." : rateLimitCooldown > 0 ? `Tente em ${rateLimitCooldown}s` : "Entrar"}
            </Button>

            {/* Divider */}
            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-stroke-light" />
              <span className="text-sm text-foregroundTertiary">ou</span>
              <span className="h-px flex-1 bg-stroke-light" />
            </div>

            {/* Social logins */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="social"
                className="w-full gap-2 normal-case tracking-normal"
                onClick={handleGoogleLogin}
                disabled={loading || rateLimitCooldown > 0}
              >
                <GoogleIcon />
                Entrar com Google
              </Button>
              <Button
                type="button"
                variant="social"
                className="w-full gap-2 normal-case tracking-normal"
                aria-label="Apple"
                disabled
              >
                <AppleIcon />
                Entrar com Apple
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-foregroundDark">
          Ainda não tem uma conta?{" "}
          <Link
            to="/signup"
            className="font-semibold text-link underline underline-offset-2 hover:text-primary"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

