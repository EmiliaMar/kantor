// axios config - connection to backend
import axios from "axios";

// API address
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";

console.log("API URL:", API_URL);

// create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// add token to every request (will be enabled in app context)
api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response and error handling
api.interceptors.response.use(
  (response) => {
    console.log("odpowiedź z API:", response.config.url);
    return response;
  },
  async (error) => {
    console.error("Błąd API:", error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
