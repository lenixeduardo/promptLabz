import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, User, Mail, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { sileo } from "sileo"
import { z } from "zod"

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
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-black">
      <path d="M16.37 1.43c.07.86-.28 1.7-.84 2.31-.6.66-1.58 1.17-2.5 1.1-.1-.84.31-1.72.83-2.27.58-.63 1.6-1.1 2.51-1.14ZM19 17.2c-.5 1.15-.74 1.66-1.39 2.68-.9 1.42-2.18 3.2-3.76 3.21-1.4.01-1.76-.92-3.66-.91-1.9.01-2.3.93-3.7.9-1.58-.01-2.79-1.6-3.7-3.02-2.53-3.97-2.8-8.63-1.24-11.1 1.11-1.77 2.86-2.8 4.5-2.8 1.68 0 2.73.92 4.12.92 1.34 0 2.16-.92 4.1-.92 1.46 0 3.01.8 4.12 2.18-3.62 1.98-3.03 7.16.21 8.86Z" />
    </svg>
  )
}

export default function Signup() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle, loginWithApple, user } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")

  useEffect(() => {
    if (user) {
      navigate("/home")
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Email validation
    const emailParsed = z.string().email("Formato de e-mail inválido").safeParse(email)
    if (!emailParsed.success) {
      sileo.error({ title: emailParsed.error.errors[0].message })
      return
    }

    if (password !== confirmPassword) {
      sileo.error({ title: "As senhas não coincidem" })
      return
    }

    // Password strength validation (8+ chars, uppercase, number)
    const passwordParsed = z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .safeParse(password)

    if (!passwordParsed.success) {
      sileo.error({ title: passwordParsed.error.errors[0].message })
      return
    }

    setLoading(true)
    const result = await signup(email, password, name.trim())
    if (result.success) {
      sileo.success({ title: "Conta criada com sucesso!" })
      if (result.needsConfirmation) {
        setPendingEmail(email)
      } else {
        navigate("/home")
      }
    } else {
      sileo.error({ title: result.error || "Erro ao criar conta" })
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    const result = await loginWithGoogle()
    if (result.success) {
      sileo.success({ title: "Conta criada com o Google!" })
      navigate("/home")
    } else {
      sileo.error({ title: result.error || "Erro ao criar conta com Google" })
    }
    setLoading(false)
  }

  const handleAppleSignup = async () => {
    setLoading(true)
    const result = await loginWithApple()
    if (result.success) {
      sileo.success({ title: "Conta criada com Apple!" })
      navigate("/home")
    } else {
      sileo.error({ title: result.error || "Erro ao criar conta com Apple" })
    }
    setLoading(false)
  }

  if (pendingEmail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-6 text-center">
        <img
          src="/assets/mascot-login-new.png"
          alt="Mascot"
          className="h-36 w-auto drop-shadow-md"
        />
        <h1 className="text-3xl font-extrabold text-[#2B5D3A]">Confirme seu e-mail</h1>
        <p className="max-w-sm text-sm text-[#4A5E52]">
          Enviamos um link de confirmação para{" "}
          <span className="font-semibold text-[#2B5D3A]">{pendingEmail}</span>.
          <br />Clique no link para ativar sua conta.
        </p>
        <Link
          to="/login"
          className="mt-2 rounded-full bg-[#2B5D3A] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-5 py-8">
      <div className="mx-auto flex w-full max-w-[420px] flex-col">
        {/* Back */}
        <Link
          to="/login"
          className="mb-2 flex w-fit items-center text-[#2E8B57] hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-5 text-center text-4xl font-extrabold text-[#2B5D3A]">
          Criar Conta
        </h1>

        {/* Mascot + speech bubble */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascot"
            className="h-36 w-auto object-contain drop-shadow-md"
          />
          <div className="relative rounded-2xl border border-[#BFE3CC] bg-white px-3 py-2 text-sm font-medium leading-snug text-[#1F2A24] shadow-sm">
            Vamos começar! 🐱
            {/* bubble tail pointing left */}
            <div
              style={{
                position: "absolute",
                left: -8,
                top: 12,
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid #BFE3CC",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: -6,
                top: 12,
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid white",
              }}
            />
          </div>
        </div>

        {/* Form card */}
        <Card className="w-full border-[#C6E7D2] bg-[#E1F2E7] p-6 shadow-md sm:p-7">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="name"
              disabled={loading}
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="email"
              required
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="new-password"
              required
              disabled={loading}
            />

            <p className="text-center text-xs text-[#4A5E52]">
              Ao criar a conta, você concorda com os{" "}
              <Link
                to="#"
                className="font-medium text-[#2E8B57] underline underline-offset-2"
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                to="#"
                className="font-medium text-[#2E8B57] underline underline-offset-2"
              >
                Política de Privacidade
              </Link>
            </p>

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar Conta"}
            </Button>

            {/* Divider */}
            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#BFD9C8]" />
              <span className="text-sm text-[#6B7A70]">ou continue com</span>
              <span className="h-px flex-1 bg-[#BFD9C8]" />
            </div>

            {/* Social logins */}
            <div className="flex justify-center gap-5">
              <Button
                type="button"
                variant="social"
                size="icon"
                aria-label="Google"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <GoogleIcon />
              </Button>
              <Button
                type="button"
                variant="social"
                size="icon"
                aria-label="Apple"
                onClick={handleAppleSignup}
                disabled={loading}
              >
                <AppleIcon />
              </Button>
              <Button type="button" variant="social" size="icon" aria-label="E-mail" disabled>
                <Mail className="h-6 w-6 text-primary" strokeWidth={2.2} />
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-[#1F2A24]">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#2E8B57] underline underline-offset-2 hover:text-primary"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
