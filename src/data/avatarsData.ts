export interface Avatar {
  id: string
  name: string
  image: string
  price: number
}

export const AVATARS: Avatar[] = [
  { id: "graduation", name: "Formando",    image: "/assets/mascot-icons/mascot_graduation.svg", price: 0   },
  { id: "book",       name: "Estudioso",   image: "/assets/mascot-icons/mascot_book.svg",        price: 50  },
  { id: "lightbulb",  name: "Criativo",    image: "/assets/mascot-icons/mascot_lightbulb.svg",   price: 80  },
  { id: "crown",      name: "Rei",         image: "/assets/mascot-icons/mascot_crown.svg",        price: 120 },
  { id: "rocket",     name: "Astronauta",  image: "/assets/mascot-icons/mascot_rocket.svg",       price: 150 },
  { id: "star",       name: "Estrela",     image: "/assets/mascot-icons/mascot_star.svg",         price: 80  },
  { id: "trophy",     name: "Campeão",     image: "/assets/mascot-icons/mascot_trophy.svg",       price: 120 },
  { id: "medal",      name: "Medalhista",  image: "/assets/mascot-icons/mascot_medal.svg",        price: 150 },
  { id: "brain",      name: "Pensador",    image: "/assets/mascot-icons/mascot_brain.svg",        price: 100 },
  { id: "heart",      name: "Apaixonado",  image: "/assets/mascot-icons/mascot_heart.svg",        price: 180 },
  { id: "celebrate",  name: "Festeiro",    image: "/assets/mascot-icons/mascot_celebrate.svg",    price: 180 },
  { id: "code",       name: "Programador", image: "/assets/mascot-icons/mascot_code.svg",         price: 220 },
  { id: "chart",      name: "Analista",    image: "/assets/mascot-icons/mascot_chart.svg",        price: 250 },
  { id: "puzzle",     name: "Estrategista",image: "/assets/mascot-icons/mascot_puzzle.svg",       price: 270 },
  { id: "target",     name: "Focado",      image: "/assets/mascot-icons/mascot_target.svg",       price: 220 },
  { id: "network",    name: "Conector",    image: "/assets/mascot-icons/mascot_network.svg",      price: 230 },
  { id: "palette",    name: "Artista",     image: "/assets/mascot-icons/mascot_palette.svg",      price: 260 },
  { id: "team",       name: "Líder",       image: "/assets/mascot-icons/mascot_team.svg",         price: 280 },
  { id: "quest",      name: "Aventureiro", image: "/assets/mascot-icons/mascot_quest.svg",        price: 200 },
  { id: "focus",      name: "Mestre",      image: "/assets/mascot-icons/mascot_focus.svg",        price: 340 },
]

export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find((a) => a.id === id)
}
