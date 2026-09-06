const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (response.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/login?error=session-expired");
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok)
    throw new Error(
      (await response.json().catch(() => ({}))).detail || "Request failed",
    );
  return response.json();
}
export const get = (path) => api(path);
export const send = (path, method, body) =>
  api(path, { method, body: JSON.stringify(body) });
