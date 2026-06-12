import { useState } from "react"
import { Link } from "react-router-dom"
import { User, Mail, Calendar, Image, Home, Award, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { updateUserProfile } from "@/lib/db"
import { sileo } from "sileo"

export default function Profile() {
  const { user, logout } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!user?.id) {
      sileo.error({ title: "Usuário não encontrado" })
      setLoading(false)
      return
    }

    try {
      const { error } = await updateUserProfile(user.id, fullName)
      if (error) throw new Error(error)
      sileo.success({ title: "Perfil atualizado com sucesso!" })
    } catch (err: any) {
      sileo.error({ title: err?.message || "Erro ao atualizar perfil" })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      sileo.success({ title: "Até logo!" })
    } else {
      sileo.error({ title: result.error || "Erro ao sair" })
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] pb-28">
      <div className="flex-1 overflow-y-auto px-5 py-8">
        <div className="mx-auto w-full max-w-[420px] flex-col">
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

          {/* Avatar Button */}
          <Link
            to="/avatars"
            className="mb-5 flex items-center justify-center gap-2 rounded-2xl border border-[#BFE3CC] bg-gradient-to-r from-[#E8F8F0] to-[#E1F2E7] px-4 py-3 font-semibold text-[#2B5D3A] transition-all hover:shadow-md"
          >
            <Image className="h-5 w-5" strokeWidth={2.2} />
            Escolher Avatar
          </Link>

          {/* Profile details card */}
          <Card className="mb-5 w-full border-[#C6E7D2] bg-[#E1F2E7] p-6 shadow-md sm:p-7">
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
          >
            <LogOut className="h-5 w-5" strokeWidth={2.2} />
            Sair da Conta
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-[#BFE3CC] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[420px] items-center justify-around px-5 py-3">
          <Link
            to="/home"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <Home className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Início</span>
          </Link>

          <div className="flex flex-col items-center gap-1 rounded-lg p-2 text-center">
            <User className="h-6 w-6 text-[#2E8B57]" strokeWidth={2.2} />
            <span className="text-xs font-bold text-[#2E8B57]">Perfil</span>
          </div>

          <Link
            to="/achievements"
            className="flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all hover:bg-[#F0FAF3]"
          >
            <Award className="h-6 w-6 text-[#9BB8A7]" strokeWidth={2.2} />
            <span className="text-xs font-semibold text-[#9BB8A7]">Conquistas</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
