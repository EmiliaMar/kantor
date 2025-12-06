// auth service - login, register, logout
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// types
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

// register
export const register = async (data: RegisterData) => {
  try {
    console.log('rejestracja:', data.email);
    
    const response = await api.post('/auth/register', data);
    
    console.log('rejestracja udana');
    return response.data;
  } catch (error: any) {
    console.error('błąd rejestracji:', error.response?.data);
    throw error.response?.data || { error: 'Błąd połączenia z serwerem' };
  }
};

// login
export const login = async (data: LoginData) => {
  try {
    console.log('logowanie:', data.email);
    
    const response = await api.post('/auth/login', data);
    
    if (response.data.success && response.data.token) {
      // save token and user data
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('logowanie udane, token zapisany');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('błąd logowania:', error.response?.data);
    throw error.response?.data || { error: 'Błąd połączenia z serwerem' };
  }
};

// logout
export const logout = async () => {
  try {
    console.log('wylogowanie');
    
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    
    console.log('wylogowano');
  } catch (error) {
    console.error('błąd wylogowania:', error);
  }
};

// get profile from API
export const getProfile = async () => {
  try {
    console.log('pobieranie profilu');
    
    const response = await api.get('/auth/me');
    
    console.log('profil pobrany');
    return response.data.user;
  } catch (error: any) {
    console.error('błąd pobierania profilu:', error.response?.data);
    throw error.response?.data || { error: 'Błąd połączenia z serwerem' };
  }
};

// check if authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
};

// get cached user from storage
export const getCachedUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    return null;
  }
};