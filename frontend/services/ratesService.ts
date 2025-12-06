// rates service - fetching exchange rates from NBP
import api from './api';

export interface ExchangeRate {
  currencyCode: string;
  currencyName: string;
  midRate: number;
  buyRate: number;
  sellRate: number;
  date: string;
  lastUpdated: string;
}

// get current rates
export const getCurrentRates = async (): Promise<ExchangeRate[]> => {
  try {
    console.log('pobieranie kursów walut...');
    
    const response = await api.get('/rates/current');
    
    console.log('kursy pobrane:', response.data.count);
    return response.data.rates;
  } catch (error: any) {
    console.error('błąd pobierania kursów:', error.response?.data);
    throw error.response?.data || { error: 'Błąd pobierania kursów' };
  }
};

// get historical rate
export const getHistoricalRate = async (currency: string, date: string) => {
  try {
    console.log('pobieranie kursu historycznego:', currency, date);
    
    const response = await api.get(`/rates/historical/${currency}/${date}`);
    
    console.log('kurs historyczny pobrany');
    return response.data.rate;
  } catch (error: any) {
    console.error('błąd pobierania kursu historycznego:', error.response?.data);
    throw error.response?.data || { error: 'Błąd pobierania kursu' };
  }
};