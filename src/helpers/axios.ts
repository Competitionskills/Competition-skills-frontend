import axios from "axios";

// ✅ Base API URL from .env file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;
console.log("✅ Axios Base URL:", API_BASE_URL);

// ✅ Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // If using authentication (cookies, tokens)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Function to set Authorization token dynamically
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// ✅ Axios Response Interceptor (Handles 401 Unauthorized Globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optional: Redirect to login or handle token refresh
    }
    return Promise.reject(error);
  }
);

export default api;
