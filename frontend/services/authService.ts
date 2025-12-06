// auth service - login and registration

import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

//data types
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// REGISTRATION
export const register = async (data: RegisterData) => {
  try {
    console.log("próba rejestracji:", data.email);

    const response = await api.post("/auth/register", data);

    console.log("rejestracja udana");
    return response.data;
  } catch (error: any) {
    console.error("błąd rejestracji:", error.response?.data);
    throw error.response?.data || { error: "Błąd połączenia z serwerem" };
  }
};

// LOGOWANIE
export const login = async (data: LoginData) => {
  try {
    console.log("próba logowania:", data.email);

    const response = await api.post("/auth/login", data);

    if (response.data.success && response.data.token) {
      // save token and user data
      await AsyncStorage.setItem("authToken", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("logowanie udane, token zapisany");
    }

    return response.data;
  } catch (error: any) {
    console.error("błąd logowania:", error.response?.data);
    throw error.response?.data || { error: "Błąd połączenia z serwerem" };
  }
};

// WYLOGOWANIE
export const logout = async () => {
  try {
    console.log("wylogowanie");

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");

    console.log("wylogowano");
  } catch (error) {
    console.error("błąd wylogowania:", error);
  }
};

// POBIERZ PROFIL
export const getProfile = async () => {
  try {
    console.log("Pobieranie profilu");

    const response = await api.get("/auth/me");

    console.log("profil pobrany");
    return response.data.user;
  } catch (error: any) {
    console.error("błąd pobierania profilu:", error.response?.data);
    throw error.response?.data || { error: "Błąd połączenia z serwerem" };
  }
};

// SPRAWDŹ CZY ZALOGOWANY
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return !!token;
  } catch (error) {
    return false;
  }
};

// POBIERZ UŻYTKOWNIKA Z PAMIĘCI
export const getCachedUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};
