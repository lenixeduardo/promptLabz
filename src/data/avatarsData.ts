export interface Avatar {
  id: string
  name: string
  image: string
  price: number
}

export const AVATARS: Avatar[] = [
  { id: "avatar-1",  name: "Estudioso",    image: "/assets/avatar-1.png", price: 0   },
  { id: "avatar-2",  name: "Inteligente",  image: "/assets/avatar-2.png", price: 50  },
  { id: "avatar-3",  name: "Focado",       image: "/assets/avatar-3.png", price: 80  },
  { id: "avatar-4",  name: "Sábio",        image: "/assets/avatar-1.png", price: 120 },
  { id: "avatar-5",  name: "Criativo",     image: "/assets/avatar-2.png", price: 150 },
  { id: "avatar-6",  name: "Persistente",  image: "/assets/avatar-3.png", price: 80  },
  { id: "avatar-7",  name: "Brilhante",    image: "/assets/avatar-1.png", price: 120 },
  { id: "avatar-8",  name: "Determinado",  image: "/assets/avatar-2.png", price: 150 },
  { id: "avatar-9",  name: "Visionário",   image: "/assets/avatar-3.png", price: 100 },
  { id: "avatar-10", name: "Maestro",      image: "/assets/avatar-1.png", price: 180 },
  { id: "avatar-11", name: "Inovador",     image: "/assets/avatar-2.png", price: 180 },
  { id: "avatar-12", name: "Estrategista", image: "/assets/avatar-3.png", price: 220 },
  { id: "avatar-13", name: "Pensador",     image: "/assets/avatar-1.png", price: 250 },
  { id: "avatar-14", name: "Explorador",   image: "/assets/avatar-2.png", price: 270 },
  { id: "avatar-15", name: "Mestre",       image: "/assets/avatar-3.png", price: 220 },
  { id: "avatar-16", name: "Erudito",      image: "/assets/avatar-1.png", price: 230 },
  { id: "avatar-17", name: "Gênio",        image: "/assets/avatar-2.png", price: 260 },
  { id: "avatar-18", name: "Iluminado",    image: "/assets/avatar-3.png", price: 280 },
  { id: "avatar-19", name: "Sábio Mor",    image: "/assets/avatar-1.png", price: 200 },
  { id: "avatar-20", name: "Supremo",      image: "/assets/avatar-2.png", price: 340 },
]

export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id)
}
