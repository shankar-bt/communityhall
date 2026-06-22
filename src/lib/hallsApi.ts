import { fetchApi } from "./apiClient";

export interface HallDetailsApi {
  hallId: number;
  hallName: string;
  doorNo: string;
  street: string;
  area: string;
  division: string;
  zone: string;
  landMark: string;
  seatingCapacity: number;
  fullDayRent: number;
  halfDayRent: number;
  depositAmount: number;
  halfDepositAmount: number;
  hallImagesList?: { hallImage?: string; imageUrl?: string; imageContent?: string }[];
  hallArea?: number;
  parkingCapacity?: number;
  gst?: number;
  ebCostPerUnit?: number;
  hallInchargeMobno?: string;
  latitude?: string;
  longitude?: string;
}

export async function fetchHalls(): Promise<HallDetailsApi[]> {
  // Mock data for frontend-only mode to prevent 500 error when backend is offline
  return [
    {
      hallId: 1,
      hallName: "Anna Nagar Corporation Community Hall",
      doorNo: "12",
      street: "2nd Avenue",
      area: "Anna Nagar",
      division: "Division 102",
      zone: "Zone 8",
      landMark: "Near Anna Nagar Tower Park",
      seatingCapacity: 800,
      fullDayRent: 25000,
      halfDayRent: 15000,
      depositAmount: 10000,
      halfDepositAmount: 5000,
      hallArea: 4500,
      parkingCapacity: 100,
      gst: 18,
      ebCostPerUnit: 10,
      hallInchargeMobno: "9876543210",
      hallImagesList: [
        { hallImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" }
      ]
    },
    {
      hallId: 2,
      hallName: "T. Nagar Corporation Community Hall",
      doorNo: "45",
      street: "G N Chetty Road",
      area: "T. Nagar",
      division: "Division 117",
      zone: "Zone 10",
      landMark: "Opposite Panagal Park",
      seatingCapacity: 1200,
      fullDayRent: 35000,
      halfDayRent: 20000,
      depositAmount: 15000,
      halfDepositAmount: 7500,
      hallArea: 6000,
      parkingCapacity: 150,
      gst: 18,
      ebCostPerUnit: 10,
      hallInchargeMobno: "9876543211",
      hallImagesList: [
        { hallImage: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80" }
      ]
    },
    {
      hallId: 3,
      hallName: "Adyar Corporation Community Hall",
      doorNo: "8",
      street: "LB Road",
      area: "Adyar",
      division: "Division 173",
      zone: "Zone 13",
      landMark: "Near Adyar Depot",
      seatingCapacity: 500,
      fullDayRent: 18000,
      halfDayRent: 10000,
      depositAmount: 8000,
      halfDepositAmount: 4000,
      hallArea: 3200,
      parkingCapacity: 50,
      gst: 18,
      ebCostPerUnit: 10,
      hallInchargeMobno: "9876543212",
      hallImagesList: [
        { hallImage: "https://images.unsplash.com/photo-1505232458627-a7272647a941?auto=format&fit=crop&q=80" }
      ]
    }
  ];
}
