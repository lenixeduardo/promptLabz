import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal } from "lucide-react"
import { AppPageHeader } from "@/components/AppPageHeader"
import { PillTabs } from "@/components/PillTabs"
import { FavoritesEmptyState } from "@/components/favorites/FavoritesEmptyState"
import { AppBottomNav } from "@/components/AppBottomNav"
import { FavoriteSuggestionItem } from "@/components/favorites/FavoriteSuggestionItem"
import {
  FAVORITES_TABS,
  FAVORITES_SUGGESTIONS,
  type FavoriteTabKey,
} from "@/data/favoritesData"
import { sileo } from "sileo"

export default function Favorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FavoriteTabKey>("prompts")

  const handleMenuClick = () => {
    sileo.info({ title: "Menu de favoritos", description: "Em breve você poderá gerenciar seus favoritos aqui." })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF7EF] to-white px-4 py-6 pb-24">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <AppPageHeader
          title="Favoritos"
          onBack={() => navigate("/home")}
          rightSlot={
            <button
              onClick={handleMenuClick}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#2F6B45] transition-colors hover:bg-[#DCF1E4]"
              aria-label="Menu"
            >
              <MoreHorizontal className="h-6 w-6" strokeWidth={2.2} />
            </button>
          }
        />

        {/* Sub-navigation tabs */}
        <PillTabs
          items={FAVORITES_TABS.map((t) => ({ key: t.key, label: t.label }))}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as FavoriteTabKey)}
          className="mb-6"
          scrollable
        />

        {/* Empty state */}
        <FavoritesEmptyState
          ctaTo={activeTab === "tracks" ? "/learn" : "/skills"}
          ctaLabel="Explorar conteúdo"
        />

        {/* Dicas para você */}
        <section className="mt-8">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#3E8E5E]">
            Dicas para você
          </h2>
          <div className="flex flex-col gap-2">
            {FAVORITES_SUGGESTIONS.map((suggestion) => (
              <FavoriteSuggestionItem
                key={suggestion.id}
                suggestion={suggestion}
              />
            ))}
          </div>
        </section>
      </div>

      <AppBottomNav />
    </div>
  )
}
