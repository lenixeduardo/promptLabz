import { useState, useEffect } from "react"
import { Share, X, Plus } from "lucide-react"

// iOS detection — we can't use beforeinstallprompt (Android/Chrome only)
function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream
}

function isInStandaloneMode(): boolean {
  return (
    ("standalone" in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone === true) ||
    window.matchMedia("(display-mode: standalone)").matches
  )
}

const DISMISSED_KEY = "promptlabz-ios-banner-dismissed"

export function IosInstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isIos()) return
    if (isInStandaloneMode()) return
    if (sessionStorage.getItem(DISMISSED_KEY)) return
    // Small delay so it doesn't flash on initial load
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Instalar PromptLabz"
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="m-3 mb-4 rounded-2xl border border-[#1E4D2F]/20 bg-white p-4 shadow-xl">
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute right-5 top-5 rounded-full p-1 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <img
            src="/icons/icon-120x120.png"
            alt="PromptLabz"
            className="h-14 w-14 shrink-0 rounded-2xl shadow-sm"
          />
          <div>
            <p className="font-bold text-[#1E4D2F]">Instalar PromptLabz</p>
            <p className="text-sm text-gray-600">
              Adicione à tela inicial para acesso rápido sem precisar abrir o Safari.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#EAF7F0] p-3 text-sm text-gray-700">
          <p className="font-semibold text-[#1E4D2F] mb-1">Como instalar:</p>
          <ol className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E4D2F] text-xs font-bold text-white">1</span>
              <span>
                Toque no botão{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-[#1E4D2F]">
                  Compartilhar <Share size={13} className="inline" />
                </span>{" "}
                na barra inferior do Safari
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E4D2F] text-xs font-bold text-white">2</span>
              <span>
                Role para baixo e toque em{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-[#1E4D2F]">
                  Adicionar à Tela de Início <Plus size={13} className="inline" />
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1E4D2F] text-xs font-bold text-white">3</span>
              <span>Toque em <span className="font-semibold text-[#1E4D2F]">Adicionar</span> para confirmar</span>
            </li>
          </ol>
        </div>

        <button
          onClick={dismiss}
          className="mt-3 w-full rounded-xl py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Agora não
        </button>
      </div>
    </div>
  )
}
