import type { Hall } from "@/contexts/AppContext";

const img = (seed: string) => `https://images.unsplash.com/photo-${seed}?w=800&q=70&auto=format&fit=crop`;

export const HALLS: Hall[] = [
  {
    id: "h1", name: "K.B.Dhasan Salai Community Center", rating: 4.4,
    image: img("1519167758481-83f550bb49b3"),
    images: [img("1519167758481-83f550bb49b3"), img("1505373877841-8d25f7d46678"), img("1464366400600-7168b8af9bc3")],
    rent: 2900, halfDayRent: 1900, deposit: 1500, halfDayDeposit: 1500, zone: "Zone 5", division: "Anna Nagar",
    landmark: "Near Tower Park", capacity: 500,
  },
  {
    id: "h2", name: "Model School Road Community Center", rating: 4.4,
    image: img("1464366400600-7168b8af9bc3"),
    images: [img("1464366400600-7168b8af9bc3"), img("1519167758481-83f550bb49b3")],
    rent: 2900, halfDayRent: 1900, deposit: 1500, halfDayDeposit: 1500, zone: "Zone 9", division: "T. Nagar",
    landmark: "Opp. Panagal Park", capacity: 800,
  },
  {
    id: "h3", name: "MMDA colony Community Center", rating: 4.4,
    image: img("1505373877841-8d25f7d46678"),
    images: [img("1505373877841-8d25f7d46678"), img("1464366400600-7168b8af9bc3")],
    rent: 2900, halfDayRent: 1900, deposit: 1500, halfDayDeposit: 1500, zone: "Zone 3", division: "Thiru Vi Ka Nagar",
    landmark: "Near Bus Stand", capacity: 250,
  },
  {
    id: "h4", name: "KK Nagar Community Center", rating: 4.4,
    image: img("1492684223066-81342ee5ff30"),
    images: [img("1492684223066-81342ee5ff30"), img("1519167758481-83f550bb49b3")],
    rent: 2900, halfDayRent: 1900, deposit: 1500, halfDayDeposit: 1500, zone: "Zone 10", division: "Adyar",
    landmark: "Near Beach Road", capacity: 1000,
  }
];
