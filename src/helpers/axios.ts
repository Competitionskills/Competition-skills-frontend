import axios from "axios";

// ✅ Base API URL from .env file

const API_BASE_URL = "https://api.scoreperks.co.uk/api" ;


console.log("✅ Axios Base URL:", API_BASE_URL);

// ✅ Create an Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Immediately attach token if exists in localStorage
const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

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
      // Optional: Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
