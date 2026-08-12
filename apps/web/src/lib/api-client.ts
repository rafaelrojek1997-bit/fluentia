const DEPLOYED_API_URL = "https://fluentia-api-yvxt.onrender.com/api/v1";
const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_URL = configuredApiUrl === "https://fluentia-api.onrender.com/api/v1"
  ? DEPLOYED_API_URL
  : configuredApiUrl ?? (process.env.NODE_ENV === "production" ? DEPLOYED_API_URL : "http://localhost:3001/api/v1");

export type ProblemDetails = { status?: number; code?: string; detail?: string | string[]; correlationId?: string };
export class ApiError extends Error {
  constructor(public readonly status: number, public readonly problem: ProblemDetails) {
    super(Array.isArray(problem.detail) ? problem.detail.join(" ") : problem.detail || problem.code || `HTTP ${status}`);
  }
}

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => { accessToken = token; };

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  try {
    const saved = JSON.parse(localStorage.getItem("fluentia-demo-v1") ?? "{}");
    headers.set("x-learning-language", saved.learningLanguage === "de" ? "de" : "en");
  } catch { headers.set("x-learning-language", "en"); }

  if (path === "/conversations" && typeof init.body === "string") {
    try {
      const body = JSON.parse(init.body);
      init = { ...init, body: JSON.stringify({ ...body, learningLanguage: headers.get("x-learning-language") ?? "en" }) };
    } catch {
      // Validation in the API remains the source of truth for malformed bodies.
    }
  }
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, { ...init, headers, credentials: "include" }); }
  catch { throw new ApiError(0, { code: "API_UNAVAILABLE", detail: "Nie można połączyć się z API. Uruchom backend na porcie 3001." }); }
  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    try {
      const refreshed = await request<{ accessToken: string }>("/auth/refresh", { method: "POST" }, false);
      setAccessToken(refreshed.accessToken);
      return request<T>(path, init, false);
    } catch { setAccessToken(null); }
  }
  if (!response.ok) {
    const problem = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, problem);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
