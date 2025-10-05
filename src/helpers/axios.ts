import axios from "axios";

const API_BASE_URL = "https://api.scoreperks.co.uk/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Always attach the latest token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // <-- make sure your login saves with this key
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // ensure header is removed if no token
    if (config.headers && "Authorization" in config.headers) {
      delete (config.headers as any).Authorization;
    }
  }
  return config;
});

// Optional helper if you set token on login
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
