import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { BrandLogo } from "@/components/BrandLogo"
import { HelpButton } from "@/components/HelpButton"
import { CroppedImage } from "@/components/CroppedImage"
import { MascotGlow } from "@/components/MascotGlow"

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

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-5 py-8">
      <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
        {/* Mascot with animated glow halo */}
        <MascotGlow size={260}>
          <CroppedImage
            src="/assets/login-wireframe.jpeg"
            naturalWidth={1179}
            naturalHeight={2049}
            crop={[250, 70, 740, 470]}
            displayWidth={230}
            blend
            alt="PromptLab mascot"
          />
        </MascotGlow>

        {/* Wordmark */}
        <BrandLogo className="mt-1 text-5xl" />

        {/* Login card */}
        <Card className="mt-7 w-full border-[#C6E7D2] bg-[#E1F2E7] p-6 shadow-md sm:p-7">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" strokeWidth={2.2} />}
              autoComplete="current-password"
            />

            <Link
              to="#"
              className="-mt-1 self-end text-sm font-medium text-[#2E8B57] underline underline-offset-2 hover:text-primary"
            >
              Esqueci minha senha
            </Link>

            <Button type="submit" size="lg" className="mt-1 w-full">
              Entrar
            </Button>

            {/* Divider */}
            <div className="my-1 flex items-center gap-3">
              <span className="h-px flex-1 bg-[#BFD9C8]" />
              <span className="text-sm text-[#6B7A70]">ou continue com</span>
              <span className="h-px flex-1 bg-[#BFD9C8]" />
            </div>

            {/* Social logins */}
            <div className="flex justify-center gap-5">
              <Button type="button" variant="social" size="icon" aria-label="Google">
                <GoogleIcon />
              </Button>
              <Button type="button" variant="social" size="icon" aria-label="Apple">
                <AppleIcon />
              </Button>
              <Button type="button" variant="social" size="icon" aria-label="E-mail">
                <Mail className="h-6 w-6 text-primary" strokeWidth={2.2} />
              </Button>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="mt-7 text-center text-base text-[#1F2A24]">
          Não tem uma conta?{" "}
          <Link
            to="#"
            className="font-semibold text-[#2E8B57] underline underline-offset-2 hover:text-primary"
          >
            Crie agora
          </Link>
        </p>
      </div>

      <HelpButton />
    </div>
  )
}
