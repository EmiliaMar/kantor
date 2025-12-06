// axios config - connection to backend
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// add token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      // get token
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        // add token to header
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("błąd pobierania tokenu:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("błąd API:", error.config?.url, error.response?.status);

    // if token expired - delete it
    if (error.response?.status === 401) {
      console.log("token wygasł - usuwam");
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;