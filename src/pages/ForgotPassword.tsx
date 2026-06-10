import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

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
          Esqueci minha senha
        </h1>

        {/* Mascot + speech bubble */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <img
            src="/assets/mascot-login-new.png"
            alt="Mascot"
            className="h-36 w-auto object-contain drop-shadow-md"
          />
          <div className="relative rounded-2xl border border-[#BFE3CC] bg-white px-3 py-2 text-sm font-medium leading-snug text-[#1F2A24] shadow-sm">
            Não se preocupe! Vamos resolver isso 😊
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

        {/* Card */}
        <Card className="w-full border-[#C6E7D2] bg-[#E1F2E7] p-6 shadow-md sm:p-7">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <Mail className="h-10 w-10 text-[#2E8B57]" strokeWidth={1.8} />
              <p className="text-base font-semibold text-[#2B5D3A]">E-mail enviado!</p>
              <p className="text-sm text-[#4A5E52]">
                Verifique sua caixa de entrada e siga o link para redefinir sua senha.
              </p>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <Input
                type="email"
                placeholder="Digite seu e-mail cadastrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
                autoComplete="email"
                required
              />
              <p className="text-center text-sm text-[#4A5E52]">
                Enviaremos um link de redefinição de senha para o seu e-mail.
              </p>
              <Button type="submit" size="lg" className="mt-1 w-full">
                Enviar link de redefinição
              </Button>
            </form>
          )}
        </Card>

        <Link
          to="/login"
          className="mt-7 text-center text-sm font-medium text-[#2E8B57] underline underline-offset-2 hover:text-primary"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
