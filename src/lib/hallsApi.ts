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
  hallImagesList?: { imageUrl?: string; imageContent?: string }[];
}

export async function fetchHalls(): Promise<HallDetailsApi[]> {
  const res = await fetchApi<HallDetailsApi[]>("/communityhall/admin/api/halldetailslist", {
    method: "GET",
  });
  return res;
}
