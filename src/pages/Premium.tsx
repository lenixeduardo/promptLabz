import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PremiumPlanCard } from "@/components/premium/PremiumPlanCard"
import { PremiumBenefitCard } from "@/components/premium/PremiumBenefitCard"
import { PremiumTrustBadge } from "@/components/premium/PremiumTrustBadge"
import {
  PREMIUM_PLANS,
  PREMIUM_FEATURES,
  PREMIUM_TRUST_ITEMS,
  type BillingCycle,
} from "@/data/premiumData"
import { cn } from "@/lib/utils"
import { AppBottomNav } from "@/components/AppBottomNav"
import { useEffect } from "react"
import { sileo } from "sileo"
import { trackPremiumViewed } from "@/lib/analytics"

export default function Premium() {
  const navigate = useNavigate()

  useEffect(() => {
    trackPremiumViewed()
  }, [])
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly")

  const handleStartPremium = () => {
    const planLabel = billingCycle === "yearly" ? "Anual" : "Mensal"
    sileo.success({
      title: "Redirecionando para checkout",
      description: `Plano ${planLabel} — Em breve você será redirecionado para o pagamento seguro.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pageBgLight to-white px-4 py-6 pb-24">
      <div className="mx-auto w-full max-w-lg">
        {/* Back button */}
        <button
          onClick={() => navigate("/home")}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full text-forest transition-colors hover:bg-surface-success"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
        </button>

        {/* Hero section */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <img
                src="/assets/mascot-teacher.png"
                alt="PromptLabz Premium"
                className="h-28 w-auto object-contain drop-shadow-md"
                style={{ mixBlendMode: "multiply" }}
              />
              {/* Crown badge */}
              <div className="absolute -right-1 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#E09000] shadow-md">
                <Sparkles className="h-4 w-4 text-white" fill="white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-foregroundDark">
            PromptLabz Premium
          </h1>
          <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-foregroundMuted">
            Desbloqueie todo o potencial da plataforma e acelere seus resultados.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {PREMIUM_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setBillingCycle(plan.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-sm font-semibold transition-colors",
                billingCycle === plan.id
                  ? "border-primary-dark bg-primary-dark text-white"
                  : "border-stroke-light bg-white text-primary-dark hover:bg-pageBgLight",
              )}
            >
              {plan.title}
              {plan.badge && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                  -40%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="mb-6 flex flex-col gap-3">
          {PREMIUM_PLANS.map((plan) => (
            <PremiumPlanCard
              key={plan.id}
              plan={plan}
              selected={billingCycle === plan.id}
              onSelect={() => setBillingCycle(plan.id)}
            />
          ))}
        </div>

        {/* Features grid */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald">
            Benefícios inclusos
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PREMIUM_FEATURES.map((feature) => (
              <PremiumBenefitCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mb-6 text-center">
          <Button
            size="lg"
            className="w-full shadow-lg shadow-primary-dark/20"
            onClick={handleStartPremium}
          >
            Começar agora
          </Button>
          <p className="mt-2 text-xs font-medium text-foregroundMuted">
            7 dias grátis. Cancele quando quiser.
          </p>
        </div>

        {/* Trust badges */}
        <div className="mb-8 flex items-center justify-center gap-6">
          {PREMIUM_TRUST_ITEMS.map((item) => (
            <PremiumTrustBadge key={item.id} item={item} />
          ))}
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
