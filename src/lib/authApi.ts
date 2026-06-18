import { fetchApi } from "./apiClient";

export interface OfficialLoginResponse {
  userType: string;
  counterName: string;
  token: string;
}

/**
 * Check if a mobile number is registered
 * @param mobileNo 10-digit mobile number
 * @returns boolean
 */
export async function checkMobileExists(mobileNo: number): Promise<boolean> {
  const res = await fetchApi<string>(`/communityhall/user/api/checkMobileExits?mobileno=${mobileNo}`, {
    method: "GET",
  });
  return res === "success";
}

/**
 * Citizen Login - Step 1: Send OTP to the mobile number
 * @param mobileNo 10-digit mobile number
 * @returns Success string
 */
export async function sendLoginOtp(mobileNo: number): Promise<string> {
  // Using purpose=login as required by the backend
  const res = await fetchApi<string>(`/communityhall/user/api/sendOTP?mobileNo=${mobileNo}&purpose=login`, {
    method: "GET",
  });
  if (res === "Error") throw new Error("Failed to send OTP");
  return res;
}

/**
 * Citizen Login - Step 2: Verify the OTP
 * @param mobileNo 10-digit mobile number
 * @param otp The OTP received by the user
 * @returns Success string
 */
export async function verifyLoginOtp(mobileNo: number, otp: string): Promise<string> {
  const res = await fetchApi<string>(`/communityhall/user/api/verifyOTP?mobileNo=${mobileNo}&otp=${otp}`, {
    method: "GET",
  });
  if (res === "Error") throw new Error("Invalid OTP");
  return res;
}

/**
 * Official Login - Authenticate using username and password
 * @param username The official username
 * @param password The official password
 * @returns JSON object containing the JWT token, user type, and counter name
 */
export async function verifyOfficialLogin(username: string, password: string): Promise<OfficialLoginResponse> {
  // Note: Passwords in GET requests should ideally be URL-encoded, but since it's a query param:
  const encodedUsername = encodeURIComponent(username);
  const encodedPassword = encodeURIComponent(password);
  
  return fetchApi<OfficialLoginResponse>(
    `/communityhall/counter/verifyLogin?username=${encodedUsername}&password=${encodedPassword}`,
    {
      method: "GET",
    }
  );
}

/**
 * Citizen Registration
 * @param formData FormData object containing User fields
 * @returns JSON response
 */
export async function registerCitizen(formData: FormData): Promise<any> {
  return fetchApi<any>(`/communityhall/user/api/newcounterregistrationform`, {
    method: "POST",
    body: formData,
  });
}
