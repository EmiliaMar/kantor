// transaction service - buy and sell currency
import api from './api';

export interface Transaction {
  id: string;
  type: string;
  fromCurrency: string | null;
  toCurrency: string;
  amount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// buy foreign currency
export const buyForeignCurrency = async (currencyCode: string, amount: number) => {
  try {
    console.log('kupno waluty:', amount, currencyCode);
    
    const response = await api.post('/transactions/buy', {
      currencyCode,
      amount,
    });
    
    console.log('transakcja kupna zakończona');
    return response.data;
  } catch (error: any) {
    console.error('błąd kupna:', error.response?.data);
    throw error.response?.data || { error: 'Błąd transakcji' };
  }
};

// sell foreign currency
export const sellForeignCurrency = async (currencyCode: string, amount: number) => {
  try {
    console.log('sprzedaż waluty:', amount, currencyCode);
    
    const response = await api.post('/transactions/sell', {
      currencyCode,
      amount,
    });
    
    console.log('transakcja sprzedaży zakończona');
    return response.data;
  } catch (error: any) {
    console.error('błąd sprzedaży:', error.response?.data);
    throw error.response?.data || { error: 'Błąd transakcji' };
  }
};

// get transaction history
export const getTransactionHistory = async (page = 1, limit = 20) => {
  try {
    console.log('pobieranie historii transakcji...');
    
    const response = await api.get(`/transactions/history?page=${page}&limit=${limit}`);
    
    console.log('historia pobrana');
    return response.data;
  } catch (error: any) {
    console.error('błąd pobierania historii:', error.response?.data);
    throw error.response?.data || { error: 'Błąd pobierania historii' };
  }
};