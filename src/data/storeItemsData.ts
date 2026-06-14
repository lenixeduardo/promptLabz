export interface GemPackage {
  id: "gems-300" | "gems-500"
  name: string
  gemAmount: number
  price: string
  badge?: string
}

export const GEM_PACKAGES: GemPackage[] = [
  {
    id: "gems-300",
    name: "300 Gemas",
    gemAmount: 300,
    price: "R$ 9,90",
  },
  {
    id: "gems-500",
    name: "500 Gemas",
    gemAmount: 500,
    price: "R$ 14,90",
    badge: "Mais Popular",
  },
]
