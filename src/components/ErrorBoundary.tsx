import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#EAF7EF] via-[#E0F3E7] to-[#D2EEDD] px-6 text-center">
          <img
            src="/assets/mascot-login-new.png"
            alt="Erro"
            className="h-32 w-auto opacity-80"
          />
          <h1 className="text-2xl font-extrabold text-[#2B5D3A]">Algo deu errado</h1>
          <p className="max-w-sm text-sm text-[#4A5E52]">{this.state.message}</p>
          <button
            onClick={() => window.location.replace("/")}
            className="mt-2 rounded-full bg-[#2B5D3A] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Voltar ao início
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
