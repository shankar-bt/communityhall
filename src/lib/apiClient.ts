/**
 * Base API Client for fetching data from the backend.
 * Uses the VITE_API_BASE_URL environment variable.
 */
const API_BASE_URL = "";

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${formattedEndpoint}`;

  const headers = new Headers(options.headers);
  if (options.body && options.body instanceof FormData) {
    // Let the browser set the Content-Type with the multipart boundary automatically
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Optional: If you implement authentication, you can retrieve the token here
  // const token = localStorage.getItem("token");
  // if (token) {
  //   headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(url, { credentials: "include", ...options, headers });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch (e) {
      errorBody = { message: `API Error: ${response.status} ${response.statusText}` };
    }
    throw new Error(errorBody.message || `API Error: ${response.status}`);
  }

  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text);
  } catch (e) {
    return text as unknown as T;
  }
}
