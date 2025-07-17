import axios from "axios";


// ✅ Base API URL from .env file

const API_BASE_URL = "https://api.scoreperks.co.uk/api" ;


console.log("✅ Axios Base URL:", API_BASE_URL);

// Create an Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set Authorization token dynamically
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Initialize token from localStorage
const storedToken = localStorage.getItem("token");
if (storedToken) {
  setAuthToken(storedToken);
}

// Axios Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 response
      setAuthToken(null);
      // Let the component handle the redirect
      return Promise.reject(new Error("Unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;