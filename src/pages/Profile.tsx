import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, User, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { sileo } from "sileo"

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      })
      if (error) throw error
      sileo.success({ title: "Perfil atualizado com sucesso!" })
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao atualizar perfil" })
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const registrationDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-5 py-8">
      <div className="mx-auto flex w-full max-w-[420px] flex-col">
        {/* Back */}
        <Link
          to="/home"
          className="mb-2 flex w-fit items-center text-[#2E8B57] hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
        </Link>

        {/* Title */}
        <h1 className="mb-5 text-center text-4xl font-extrabold text-[#2B5D3A]">
          Meu Perfil
        </h1>

        {/* Mascot & info card */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <img
            src="/assets/mascot-teacher.png"
            alt="Mascot"
            className="h-36 w-auto object-contain drop-shadow-md"
          />
          <div className="relative rounded-2xl border border-[#BFE3CC] bg-white px-3 py-2 text-sm font-medium leading-snug text-[#1F2A24] shadow-sm">
            Aqui você gerencia seus dados! 💡
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

        {/* Profile details card */}
        <Card className="w-full border-[#C6E7D2] bg-[#E1F2E7] p-6 shadow-md sm:p-7">
          <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
                Nome completo
              </label>
              <Input
                type="text"
                placeholder="Insira seu nome"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-5 w-5" strokeWidth={2.2} />}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
                E-mail
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
                disabled
              />
            </div>

            <div className="flex items-center gap-2 px-2 py-1 text-sm text-[#4A5E52]">
              <Calendar className="h-4 w-4" />
              <span>Cadastrado em: {registrationDate}</span>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
